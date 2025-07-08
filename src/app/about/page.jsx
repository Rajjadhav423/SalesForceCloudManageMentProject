"use client";
import React from 'react';
import {
  Card,
  Typography,
  Divider,
  Space,
  Tag,
  Row,
  Col,
  List,
  Avatar,
  Badge
} from 'antd';
import {
  CloudOutlined,
  RocketOutlined,
  EyeOutlined,
  GiftOutlined,
  HeartOutlined,
  TeamOutlined,
  SafetyOutlined,
  BulbOutlined,
  TrophyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
  const features = [
    {
      icon: <CloudOutlined className="text-blue-500" />,
      title: "Seamless Salesforce Integration",
      description: "Real-time data sync with your Salesforce environment"
    },
    {
      icon: <BulbOutlined className="text-yellow-500" />,
      title: "AI-Powered Query Assistant",
      description: "Effortless data retrieval with intelligent assistance"
    },
    {
      icon: <ThunderboltOutlined className="text-purple-500" />,
      title: "Modern Responsive UI",
      description: "Dark and light theme support with intuitive design"
    },
    {
      icon: <TrophyOutlined className="text-green-500" />,
      title: "Advanced Reporting Tools",
      description: "Schema visualization and automation capabilities"
    },
    {
      icon: <TeamOutlined className="text-orange-500" />,
      title: "Dedicated Support",
      description: "Regular feature updates and customer assistance"
    }
  ];

  const values = [
    { label: "Innovation", color: "blue", icon: <RocketOutlined /> },
    { label: "Security", color: "red", icon: <SafetyOutlined /> },
    { label: "User-Centric", color: "green", icon: <HeartOutlined /> },
    { label: "Transparency", color: "orange", icon: <EyeOutlined /> },
    { label: "Reliability", color: "purple", icon: <TrophyOutlined /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-stretch">
      <div className="w-full max-w-6xl mx-auto">
        <Card className="shadow-xl border-0 bg-white rounded-3xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-10 text-center">
            <Space direction="vertical" size="large" className="w-full">
              <Avatar
                size={80}
                icon={<CloudOutlined />}
                className="bg-white text-blue-600 shadow-md"
              />
              <Title level={1} className="text-white mb-0 text-4xl font-bold">
                About Us
              </Title>
              <Paragraph className="text-blue-100 text-lg mb-0 max-w-2xl mx-auto">
                Empowering businesses with modern, AI-driven Salesforce management solutions
              </Paragraph>
            </Space>
          </div>

          {/* Body Sections */}
          <div className="p-10 space-y-8">
            {/* Who We Are */}
            <Card className="bg-blue-50 border border-blue-100 rounded-2xl">
              <Space direction="vertical" size="middle" className="w-full">
                <Title level={2} className="text-blue-800 flex items-center gap-2">
                  <TeamOutlined className="text-blue-600" />
                  Who We Are
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed">
                  <Text strong className="text-blue-700">Cloud Force CRM Manager</Text> is a next-generation platform designed to simplify and enhance your Salesforce experience. Our mission is to provide intuitive, powerful, and secure tools for managing your CRM data, automating workflows, and gaining actionable insights.
                </Paragraph>
              </Space>
            </Card>

            {/* Vision */}
            <Card className="bg-purple-50 border border-purple-100 rounded-2xl">
              <Space direction="vertical" size="middle" className="w-full">
                <Title level={2} className="text-purple-800 flex items-center gap-2">
                  <EyeOutlined className="text-purple-600" />
                  Our Vision
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed">
                  We believe in making cloud CRM management accessible and efficient for organizations of all sizes. By leveraging the latest technologies in AI, automation, and UI/UX, we help teams focus on what matters most—building strong customer relationships.
                </Paragraph>
              </Space>
            </Card>

            {/* Offerings */}
            <Card className="bg-green-50 border border-green-100 rounded-2xl">
              <Space direction="vertical" size="middle" className="w-full">
                <Title level={2} className="text-green-800 flex items-center gap-2">
                  <GiftOutlined className="text-green-600" />
                  What We Offer
                </Title>
                <Row gutter={[16, 16]}>
                  {features.map((feature, index) => (
                    <Col xs={24} md={12} key={index}>
                      <Card
                        className="h-full bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow rounded-xl"
                        bodyStyle={{ padding: '16px' }}
                      >
                        <Space direction="vertical" size="small" className="w-full">
                          <div className="flex items-center gap-3">
                            <Avatar size={40} icon={feature.icon} className="bg-gray-100" />
                            <Title level={4} className="mb-0 text-gray-800">
                              {feature.title}
                            </Title>
                          </div>
                          <Paragraph className="text-gray-600 text-sm">
                            {feature.description}
                          </Paragraph>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Space>
            </Card>

            {/* Values */}
            <Card className="bg-orange-50 border border-orange-100 rounded-2xl">
              <Space direction="vertical" size="middle" className="w-full">
                <Title level={2} className="text-orange-800 flex items-center gap-2">
                  <HeartOutlined className="text-orange-600" />
                  Our Values
                </Title>
                <div className="flex flex-wrap gap-4">
                  {values.map((value, index) => (
                    <Badge.Ribbon
                      key={index}
                      text={value.icon}
                      color={value.color}
                      className="rounded-md"
                    >
                      <Tag
                        color={value.color}
                        className="px-4 py-2 text-base font-medium rounded-full border-0 shadow"
                      >
                        {value.label}
                      </Tag>
                    </Badge.Ribbon>
                  ))}
                </div>
              </Space>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 rounded-2xl">
              <div className="text-center space-y-4">
                <Title level={3} className="text-white">
                  Ready to Transform Your CRM Experience?
                </Title>
                <Paragraph className="text-indigo-100 text-base">
                  Join thousands of businesses already using Cloud Force CRM Manager to streamline their Salesforce operations.
                </Paragraph>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Tag color="success" className="px-4 py-2 text-sm font-medium rounded-full">
                    Trusted by 1000+ Companies
                  </Tag>
                  <Tag color="warning" className="px-4 py-2 text-sm font-medium rounded-full">
                    99.9% Uptime
                  </Tag>
                  <Tag color="processing" className="px-4 py-2 text-sm font-medium rounded-full">
                    24/7 Support
                  </Tag>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}
