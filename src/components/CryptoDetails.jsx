import React, { useState, useEffect } from "react";
import HTMLReactParser from "html-react-parser";
import { useParams } from "react-router-dom";
import millify from "millify";
import { Row, Col, Typography, Select } from "antd";
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  CheckOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} from "../services/cryptoAPI";
import LineChart from "./LineChart";
import Loader from "./Loader";

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timePeriod, setTimePeriod] = useState("7d");
  const { data } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory, isFetching: isHistoryFetching } =
    useGetCryptoHistoryQuery({
      coinId,
      timePeriod,
    });
  const cryptoDetails = data && data.data ? data.data.coin : null;

  const time = ["3h", "24h", "7d", "30d", "1y", "3m", "3y", "5y"];

  const stats = cryptoDetails
    ? [
        {
          title: "Price to USD",
          value: `$ ${cryptoDetails.price && millify(cryptoDetails.price)}`,
          icon: <DollarCircleOutlined />,
        },
        { title: "Rank", value: cryptoDetails.rank, icon: <NumberOutlined /> },
        {
          title: "24h Volume",
          value: `$ ${cryptoDetails.volume && millify(cryptoDetails.volume)}`,
          icon: <ThunderboltOutlined />,
        },
        {
          title: "Market Cap",
          value: `$ ${
            cryptoDetails.marketCap && millify(cryptoDetails.marketCap)
          }`,
          icon: <DollarCircleOutlined />,
        },
        {
          title: "All-time-high(daily avg.)",
          value: `$ ${millify(cryptoDetails.allTimeHigh.price)}`,
          icon: <TrophyOutlined />,
        },
      ]
    : [];

  const genericStats = cryptoDetails
    ? [
        {
          title: "Number Of Markets",
          value: cryptoDetails.numberOfMarkets,
          icon: <FundOutlined />,
        },
        {
          title: "Number Of Exchanges",
          value: cryptoDetails.numberOfExchanges,
          icon: <MoneyCollectOutlined />,
        },
        {
          title: "Aprroved Supply",
          value: cryptoDetails.approvedSupply ? (
            <CheckOutlined />
          ) : (
            <StopOutlined />
          ),
          icon: <ExclamationCircleOutlined />,
        },
        {
          title: "Total Supply",
          value: `$ ${millify(cryptoDetails.totalSupply)}`,
          icon: <ExclamationCircleOutlined />,
        },
        {
          title: "Circulating Supply",
          value: `$ ${millify(cryptoDetails.circulatingSupply)}`,
          icon: <ExclamationCircleOutlined />,
        },
      ]
    : [];

  useEffect(() => {
    if (!isHistoryFetching) {
      console.log(coinHistory);
    } else {
      return <Loader />;
    }
  }, [coinHistory]);

  return (
    <Col className="coin-detail-container">
      {cryptoDetails && (
        <Col className="coin-heading-container">
          <Title level={2} className="coin-name">
            {cryptoDetails.name} (${cryptoDetails.slug}) Price
          </Title>
          <p>
            {cryptoDetails.name} live price in USD. View value statistics,
            market cap and supply.
          </p>
          <Select
            defaultValue="7d"
            className="select-timeperiod"
            placeholder="Select Time Period"
            onChange={(value) => setTimePeriod(value)}
          >
            {time.map((period, i) => (
              <Option key={i}>{period}</Option>
            ))}
          </Select>
          {coinHistory && (
            <LineChart
              coinHistory={coinHistory}
              currentPrice={millify(cryptoDetails.price)}
              coinName={cryptoDetails.name}
            />
          )}
          <Col className="stats-container">
            <Col className="coin-value-statistics">
              <Col className="coin-value-statistics-heading">
                <Title level={3} className="coin-details-heading">
                  {cryptoDetails.name} Value Statistics
                </Title>
                <p>An overview of the statistics for {cryptoDetails.name}.</p>
              </Col>
              {stats.map(({ icon, title, value }) => (
                <Col className="coin-stats" key={value}>
                  <Col className="coin-stats-name">
                    <Text>{icon}</Text>
                    <Text>{title}</Text>
                  </Col>
                  <Text className="stats"> {value}</Text>
                </Col>
              ))}
            </Col>
            <Col className="other-stats-info">
              <Col className="coin-value-statistics-heading">
                <Title level={3} className="coin-details-heading">
                  Total Crypto Statistics
                </Title>
                <p>An overview of the statistics of all cryptocurrencies</p>
              </Col>
              {genericStats.map(({ icon, title, value }) => (
                <Col className="coin-stats">
                  <Col className="coin-stats-name">
                    <Text>{icon}</Text>
                    <Text>{title}</Text>
                  </Col>
                  <Text className="stats"> {value}</Text>
                </Col>
              ))}
            </Col>
          </Col>
        </Col>
      )}
      {cryptoDetails && (
        <Col className="coin-desc-link">
          <Row className="coin-desc">
            <Title level={3} className="coin-detailes-heading">
              What is {cryptoDetails.name}?
              {HTMLReactParser(cryptoDetails.description)}
            </Title>
          </Row>
          <Col className="coin-links">
            <Title level={3} className="coin-details-heading">
              {cryptoDetails.name} Links
            </Title>
            {cryptoDetails.links.map((link, id) => (
              <Row className="coin-link" key={link.id}>
                <Title level={5} className="link-name">
                  {link.type}
                </Title>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.name}
                </a>
              </Row>
            ))}
          </Col>
        </Col>
      )}
    </Col>
  );
};

export default CryptoDetails;
