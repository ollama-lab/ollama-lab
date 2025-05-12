use std::sync::LazyLock;

use scraper::{Html, Selector};
use url::Url;

use crate::{errors::Error, models::models::{SearchItem, Tag}, utils::http::DEFAULT_CLIENT};

const DEFAULT_URL_BASE: &str = "https://ollama.com/search";

static LIST_ROOT_SELECTOR: LazyLock<Selector> = LazyLock::new(||
    Selector::parse("#searchresults > ul[role=list]").unwrap()
);

static LIST_ITEM_SELECTOR: LazyLock<Selector> = LazyLock::new(||
    Selector::parse("li").unwrap()
);

static LINK_SELECTOR: LazyLock<Selector> = LazyLock::new(||
    Selector::parse("a").unwrap()
);

static NAME_FIELD_SELECTOR: LazyLock<Selector> = LazyLock::new(||
    Selector::parse("div:nth-child(1) > h2 > span").unwrap()
);

static DESCRIPTION_FIELD_SELECTOR: LazyLock<Selector> = LazyLock::new(||
    Selector::parse("div:nth-child(1) > p").unwrap()
);

static TAGS_FIELD_SELECTOR: LazyLock<Selector> = LazyLock::new(||
    Selector::parse("div:nth-child(2) > div > span").unwrap()
);

static PULLS_FIELD_SELECTOR: LazyLock<Selector> = LazyLock::new(||
    Selector::parse("div:nth-child(2) > p > span:nth-child(1) > span:nth-child(1)").unwrap()
);

static TAG_COUNT_FIELD_SELECTOR: LazyLock<Selector> = LazyLock::new(||
    Selector::parse("div:nth-child(2) > p > span:nth-child(2) > span:nth-child(1)").unwrap()
);

static UPDATED_FIELD_SELECTOR: LazyLock<Selector> = LazyLock::new(||
    Selector::parse("div:nth-child(2) > p > span:nth-child(3) > span:nth-child(1)").unwrap()
);

#[tauri::command]
pub async fn search_model(keyword: String) -> Result<Vec<SearchItem>, Error> {
    let html = DEFAULT_CLIENT.get(Url::parse_with_params(DEFAULT_URL_BASE, &[
        ("q", keyword),
    ])?)
    .send()
    .await?
    .text()
    .await?;

    let document = Html::parse_document(&html);

    document.select(&LIST_ROOT_SELECTOR)
        .next()
        .map(|list_root| {
            list_root.select(&LIST_ITEM_SELECTOR)
                .filter_map(|item| {
                    item.select(&LINK_SELECTOR)
                        .next()
                        .map(|link| {
                            SearchItem {
                                name: link.select(&NAME_FIELD_SELECTOR)
                                    .next()
                                    .map(|element| element.inner_html())
                                    .unwrap_or_else(|| String::new()),
                                description: link.select(&DESCRIPTION_FIELD_SELECTOR)
                                    .next()
                                    .map(|element| element.inner_html()),
                                tags: link.select(&TAGS_FIELD_SELECTOR)
                                    .map(|element| Tag::infer_by_class_name(
                                        element.attr("class").unwrap_or(""),
                                        element.inner_html(),
                                    ))
                                    .collect(),
                                pulls: link.select(&PULLS_FIELD_SELECTOR)
                                    .map(|element| element.inner_html())
                                    .collect(),
                                tag_count: link.select(&TAG_COUNT_FIELD_SELECTOR)
                                    .map(|element| element.inner_html())
                                    .collect(),
                                updated: link.select(&UPDATED_FIELD_SELECTOR)
                                    .map(|element| element.inner_html())
                                    .collect(),
                            }
                        })
                })
                .collect()
        })
        .ok_or(Error::HtmlParse)
}
