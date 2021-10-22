import React, { useState, useEffect } from "react";
import { Select, Typography, Row, Col, Avatar, Card } from "antd";
import moment from "moment";
import { useGetCryptoNewsQuery } from "../services/cryptoNewsAPI";
import { useGetCryptosQuery } from "../services/cryptoAPI";

const { Text, Title } = Typography;
const { Options } = Select;

const demoImage =
  "http://coinrevolution.com/wp-content/uploads/2020/06/cryptonews.jpg";

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState("Cryptocurrency");
  const { data: cryptoNews, isFetching } = useGetCryptoNewsQuery({
    newsCategory,
    count: simplified ? 6 : 12,
  });
  const { data } = useGetCryptosQuery(100);

  useEffect(() => {
    if (
      !isFetching &&
      cryptoNews !== undefined &&
      cryptoNews.value !== undefined
    ) {
      console.log("[News Component]", cryptoNews);
    } else {
      return "Loading...";
    }
  }, [cryptoNews]);

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="select a Crypto"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {data &&
              data.data &&
              data.data.coins.map((coin) => (
                <Option value={coin.name} key={coin.name}>
                  {coin.name}
                </Option>
              ))}
          </Select>
        </Col>
      )}
      {cryptoNews &&
        cryptoNews.value.map((news, i) => (
          <Col xsxs={24} sm={12} lg={8} key={i}>
            <Card hoverable className="news-card">
              <a href={news.url} target="_blank" rel="noreferrer">
                <div className="news-image-container">
                  <Title level={4} className="news-title">
                    {news.name}
                  </Title>
                  <img
                    src={
                      news && news.image && news.image.thumbnail
                        ? news.image.thumbnail.contentUrl
                        : demoImage
                    }
                    alt="news"
                    style={{ maxWidth: "200px", maxHeight: "100px" }}
                  />
                </div>
                <p>
                  {news.description > 100
                    ? `${news.description.substring(0, 100)}...`
                    : news.description}
                </p>
                <div className="provider-container">
                  <div className="">
                    <Avatar
                      src={
                        news &&
                        news.provider[0] &&
                        news.provider[0].image &&
                        news.provider[0].image.thumbnail
                          ? news.provider[0].image.thumbnail.contentUrl
                          : demoImage
                      }
                      alt="news"
                    />
                    <Text className="provider-name">
                      {news && news.provider[0] ? news.provider[0].name : ""}
                    </Text>
                  </div>
                  <Text>
                    {moment(news.datePublished).startOf("ss").fromNow()}
                  </Text>
                </div>
              </a>
            </Card>
          </Col>
        ))}
    </Row>
  );
};

export default News;
