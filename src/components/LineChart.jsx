import React from "react";
// import { Line } from "react-chartjs-2";
import { Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const LineChart = ({ coinHistory, currentPrice, coinName }) => {
  const coinPrices = [];
  const coinTimestamps = [];

  if (coinHistory && coinHistory.data && coinHistory.data.history) {
    for (let i = 0; i < coinHistory.data.history.length; i++) {
      coinPrices.push(coinHistory.data.history[i].price);
      coinTimestamps.push(
        new Date(coinHistory.data.history[i].timestamp).toLocaleDateString()
      );
    }
  }

  const data = {
    labels: coinTimestamps,
    datasets: [
      {
        label: "Price in USD",
        data: coinPrices,
        fill: false,
        backgroundColor: "#0071bd",
        borderColor: "#0071bd",
      },
    ],
  };
  const options = {
    scales: {
      yAxes: [
        {
          ticks: { beginAtZero: true },
        },
      ],
    },
  };

  return (
    <React.Fragment>
      <Row className="chart-header">
        <Title level={2} className="chart-title">
          {coinName} Price Chart
        </Title>
        <Col className="price-container">
          <Title level={5} className="price-change">
            {coinHistory && coinHistory.data ? coinHistory.data.change : ""}%
          </Title>
          <Title level={5} className="current-price">
            Current {coinName} Price: ${currentPrice}
          </Title>
        </Col>
      </Row>
      {/* <Line data={data} options={options} /> */}
      <Text>Currently, There is an issue using Chart.js </Text>
    </React.Fragment>
  );
};

export default LineChart;
