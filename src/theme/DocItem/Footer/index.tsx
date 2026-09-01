/**
 * Swizzled DocItem/Footer
 * 在文档页脚注入 TechArticle JSON-LD（headline/description/dateModified/author），
 * 提升 AI/搜索引擎对文档内容的识别与新鲜度信号。
 * 其余逻辑保持 Docusaurus 原样。
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import TagsListInline from '@theme/TagsListInline';

import EditMetaRow from '@theme/EditMetaRow';
import {DOC_FIRST_COMMIT_DATES} from '@site/src/generated/docFirstCommitDates';

function TechArticleJsonLd(): ReactNode {
  const {metadata} = useDoc();
  const {i18n} = useDocusaurusContext();
  const {title, description, permalink, lastUpdatedAt, lastUpdatedBy} =
    metadata;

  // 仅当有可用字段时才注入，避免脏数据
  if (!title) {
    return null;
  }

  const siteUrl = 'https://memfit.ai';
  // canonical 与 sitemap 已统一带尾斜杠（trailingSlash: true），schema URL 保持一致
  const permalinkWithSlash =
    permalink && !permalink.endsWith('/') ? `${permalink}/` : permalink;
  const absoluteUrl = permalinkWithSlash?.startsWith('http')
    ? permalinkWithSlash
    : `${siteUrl}${permalinkWithSlash ?? ''}`;

  // GEO：headline 带产品名前缀——「概览」这类短标题脱离页面上下文后对 AI 是零信息量
  const headline = /memfit/i.test(title) ? title : `Memfit AI - ${title}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    // GEO：@id 供其他实体引用挂入实体图；inLanguage 消歧 zh/en 双语版本
    '@id': `${absoluteUrl}#article`,
    inLanguage: i18n.currentLocale === 'en' ? 'en-US' : 'zh-CN',
    headline,
    ...(description ? {description} : {}),
    url: absoluteUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl,
    },
    image: 'https://memfit.ai/img/memfit-ai-concept.jpg',
    publisher: {
      '@type': 'Organization',
      '@id': 'https://memfit.ai/#organization',
      name: 'Memfit AI',
      url: 'https://memfit.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://memfit.ai/img/logo.png',
      },
    },
    // 作者使用组织实体（Yaklang 团队），而非个人 git handle；
    // GEO：author @id 与首页 parentOrganization 的外部实体 @id 统一为同一个，
    // 避免同一实体在实体图中出现两个互不引用的悬空 @id
    author: {
      '@type': 'Organization',
      '@id': 'https://yaklang.com/#organization',
      name: 'Yaklang Team',
      url: 'https://yaklang.com',
    },
    // speakable：声明 AI 助手可朗读的标题与首段直答区段
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [
        '.theme-doc-markdown > header > h1',
        '.theme-doc-markdown > h2:first-of-type',
        '.theme-doc-markdown > h2:first-of-type + p',
      ],
    },
  };

  // dateModified：git 最后提交时间（兜底 SSG 构建时间）
  const modifiedIso = lastUpdatedAt
    ? new Date(lastUpdatedAt).toISOString()
    : new Date().toISOString();
  schema.dateModified = modifiedIso;

  // datePublished：git 首次提交时间（构建前由 scripts/gen-first-commit-dates.mjs 生成），
  // 避免与 dateModified 同值形成「发布即最新」弱信号；取不到时回退 modifiedIso
  const permalinkKey = (permalink ?? '').replace(/\/+$/, '');
  const firstCommitIso = DOC_FIRST_COMMIT_DATES[permalinkKey];
  schema.datePublished = firstCommitIso ?? modifiedIso;

  const pageTwitterTitle = `${title} | Memfit AI`;

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      {/* 补齐 og / twitter 元数据，提升 AI 平台解析完整性 */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={pageTwitterTitle} />
      {description ? (
        <>
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      ) : null}
      <meta property="article:modified_time" content={modifiedIso} />
      <meta name="twitter:title" content={pageTwitterTitle} />
    </Head>
  );
}

export default function DocItemFooter(): ReactNode {
  const {metadata} = useDoc();
  const {editUrl, lastUpdatedAt, lastUpdatedBy, tags, permalink} = metadata;
  const {i18n} = useDocusaurusContext();
  const isEn = i18n.currentLocale === 'en';

  // 可见「发布于」日期：datePublished 只在 schema 里，AIO/ChatGPT 对页面可见日期权重更高
  const permalinkKey = (permalink ?? '').replace(/\/+$/, '');
  const firstCommitIso = DOC_FIRST_COMMIT_DATES[permalinkKey];

  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);

  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;

  return (
    <>
      <TechArticleJsonLd />
      {firstCommitIso && (
        <div
          className="margin-bottom--sm"
          style={{fontSize: '0.9em', color: 'var(--ifm-color-emphasis-700)'}}>
          {isEn ? 'Published: ' : '发布于：'}
          <time dateTime={firstCommitIso}>
            {new Date(firstCommitIso).toLocaleDateString(
              isEn ? 'en-US' : 'zh-CN',
              {year: 'numeric', month: 'long', day: 'numeric'},
            )}
          </time>
        </div>
      )}
      {canDisplayFooter && (
        <footer
          className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}>
          {canDisplayTagsRow && (
            <div
              className={clsx(
                'row margin-top--sm',
                ThemeClassNames.docs.docFooterTagsRow,
              )}>
              <div className="col">
                <TagsListInline tags={tags} />
              </div>
            </div>
          )}
          {canDisplayEditMetaRow && (
            <EditMetaRow
              className={clsx(
                'margin-top--sm',
                ThemeClassNames.docs.docFooterEditMetaRow,
              )}
              editUrl={editUrl}
              lastUpdatedAt={lastUpdatedAt}
              lastUpdatedBy={lastUpdatedBy}
            />
          )}
        </footer>
      )}
    </>
  );
}
