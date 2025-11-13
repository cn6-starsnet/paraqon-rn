import React, { FC, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
const { width: screenWidth } = Dimensions.get('window');
const PrivateSales: FC = () => {
  const contents = {
    header: {
      banner_image: "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/f299e7d7-324a-4693-9c58-952ffd727247.webp",
      title: "PARAQON的私人洽购",
      description: `如果您想购买最华丽的珠宝艺术品，或者为您独特的收藏寻找最稀有的宝石，或者为您心爱的珠宝寻找合适的买家，我们经验丰富的专家将为您提供真正的个性化服务为您的旅程提供建议和帮助。我们将全球市场专业知识与广泛的个人关系相结合，以实现最佳结果。私下出售时，交易价格基于双方协议，并完全保密。`
    },
    items: [
      {
        cover_image:
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/c0cdcec9-3ad4-40f8-b18b-c757dcb0ce41.webp",
        title: "“红凤凰”",
        description: "缅甸红宝石和钻石项链",
        images: [
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/f3156e93-20cd-4535-9a04-db17a065700b.webp",
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/1cac0220-bcc3-4d73-adbd-cdc5a7f73d60.webp",
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/6d6c6746-280b-4926-ab59-1122b41fbac9.webp",
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/f48dc0c7-ab3c-4e4b-a4da-b987516a2801.webp",
        ],
        html: `<h5 class="font-weight-bold">'红凤凰'</h5>
                            <h6>缅甸红宝石与钻石项链</h6>
                            <text>
                                这条项链的中心舞台上，六十颗非凡的缅甸红宝石闪耀着活力四射的红色和钻石的璀璨火光，结合大胆的珠宝设计，真的是一种壮观的视觉盛宴。
                            </text>
                            <text>
                                '红凤凰'中包含的红宝石总重为57.71克拉，均来自一个神奇而美妙的地方——缅甸。缅甸的红宝石通常被认为是最优质的血统。
                            </text>
                            <text>
                                这些红宝石的颜色被几家主要的宝石学实验室，如Gübelin、GIA和GRS，认证为'鸽血红'——这种精美宝石中最令人向往和有价值的颜色变种。它们在紫外线下也表现出强烈的红色荧光，这种反应通常在未经处理的天然红宝石中观察到。
                            </text>
                            <text>
                            '红凤凰'项链的设计灵感来自于希腊神话中的不死鸟凤凰，象征着周期性的再生，设计中火红的宝石呼应了凤凰的重生，色彩鲜艳且具有独特的红黄羽毛。
                            </text>
                            <text>
                                这条项链充满了超越物质世界的隐喻，由获奖设计师James W. Currens设计和制造。他的叙事珠宝作品不仅捕捉了独特宝石的本质，还被形容为'适合当代生活方式的实用精神'。
                            </text>
                            <text>
                                'Faidee'这个名字追溯到超过100年的动态宝石交易历史。凭借在缅甸宝石领域的专业知识，它垂直整合了从红宝石开采、切割到珠宝制造的每一个环节，确保在行业中达到最高标准。
                            </text>
                        `,
        path: "/contact-us",
        button: "提出查询",
      },
      {
        cover_image:
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/87917117-8694-4a44-a22e-87e36eb055fe.webp",
        title: "无瑕且稀有的钻石",
        description: null,
        images: [
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/01ecc98e-0f2a-436c-afc9-ba8f0eb5d9ea.webp",
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/jpg/69cce9ca-c907-45ed-9dd1-d7251778772c.jpg",
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/0093959b-8df6-4c9f-a5b6-dc8e5883855c.webp",
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/90e793c4-7a2a-45a5-b0d7-3c9b822446bc.webp",
        ],
        html: `<h5 class="font-weight-bold">无瑕且稀有的钻石</h5>
                            <text>
                            在数十亿年的时间里，地球地幔深处数百公里的极端高温和高压下，大自然孕育出了其最珍贵和美丽的创造之一——钻石。人类自公元前四世纪以来就开始欣赏其辉煌与价值。如今，平均每个钻石矿的产量为1部分钻石对100万部分母岩，而其中仅有20%适合用于珠宝，因此高品质的大天然钻石市场依然强劲。
                            </text>
                            <text>
                                宝石级钻石通常根据其大小、颜色、净度和切工的微妙差异进行评估。钻石价值与克拉重量之间的非线性关系显示了大石头的稀有性和吸引力。钻石的颜色评级为D到Z，D为无色且最具价值。相对而言，彩色钻石的评级则基于超出此范围的颜色饱和度，红色和蓝色的色调极为稀有。最高的净度等级称为'无瑕（FL）'，表示没有天然钻石的独特标记（称为内含物和瑕疵）——这种情况极为罕见。稀有钻石的切割经过精心规划和计算，以释放其最佳的辉煌、火彩和闪烁，通常涉及特意开发的技术和最精确的工艺。
                            </text>
                            <text>
                                然而，还有另一种属性在原子层面上将最稀有的钻石区分开来：钻石类型。IIa型钻石是最结构纯净的，晶体格中没有氮或硼元素。因此，它们完全无色和透明，被视为完美。它们占所有发现的天然钻石的比例不到2%。许多著名的大钻石，如库里南、克霍诺尔、莱塞迪·拉·罗娜和卢洛玫瑰都属于IIa型。
                            </text>
                            <text>
                            我们的公司名称源自英文单词'Paragon'，意为'超过100克拉的完美钻石'，我们努力成为您获取完美钻石的最佳合作伙伴。
                            </text>
                        `,
        path: "/contact-us",
        button: "提出查询",
      },
      {
        cover_image:
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/a39bc69e-c994-43b5-94e0-b83866c21e80.webp",
        title: "“帝王绿”",
        description: "最好的翡翠",
        images: [
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/fc300c51-6d05-4100-aa89-6a156b9210a0.webp",
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/7cc89f37-cdb0-4020-84b6-609eddcee289.webp",
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/74b818c1-cc50-468f-889f-bb458101bf08.webp",
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/672a20d6-1fc4-4f8f-85fa-056736a96d91.webp",
        ],
        html: `<h5 class="font-weight-bold">帝王绿'</h5>
                            <h6>最精美的翡翠</h6>
                            <text>
                                翡翠，或用中文称为'玉'，在迷人的宝石世界中一直占据着特殊的地位，其最著名的故事与中国文化和历史深刻相关。这种精美的石头被认为具有许多美德，如治愈能力、好运、繁荣、长寿、幸福和爱情。因此，翡翠在皇室中备受青睐，其价值一直高于其他任何宝石。
                            </text>
                            <text>
                                翡翠的颜色种类繁多，包括绿色、紫色、红色、黄色、白色和黑色。然而，最受欢迎的颜色是深沉、富饶且均匀分布的翡翠绿，被称为'帝王绿'，几乎仅在缅甸的翡翠矿床中发现。
                            </text>
                            <text>
                                与常规切割宝石的耀眼光泽不同，这种翡翠是一种多晶聚集体，具有独特的细腻矿物结构，能够均匀散射和反射光线，因其高透明度而产生不寻常的光辉效果。
                            </text>
                            <text>
                                翡翠常以简单形式如珠子、圆形、环和手镯展现其迷人的光学效果。其他则被巧妙地雕刻成字符和符号，赋予作品及佩戴者相应的象征力量。
                            </text>
                            <text>
                            在PARAQON位于香港的办公室，我们利用与中国翡翠市场资源的紧密联系，努力为您带来独特美丽和极高稀有性的翡翠珠宝，将其颜色、质地、设计和工艺的独特特征结合在一起。
                            </text>
                        `,
        path: "/contact-us",
        button: "提出查询"
      },
    ],
  }

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleCollapse = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: contents.header.banner_image }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <View style={styles.mainContent}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{contents.header.title}</Text>
          <Text style={styles.headerDescription}>
            {contents.header.description}
          </Text>
        </View>
        <View style={styles.itemsContent}>
          {contents.items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Image
                source={{ uri: item.cover_image }}
                style={styles.itemCoverImage}
                resizeMode="cover"
              />
              <View style={styles.itemMainContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
                <TouchableOpacity
                  style={styles.collapseHeader}
                  onPress={() => toggleCollapse(index)}
                >
                  <Text style={styles.collapseIcon}>
                    {expandedIndex === index ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>
                {expandedIndex === index && (
                  <View style={styles.collapseDetail}>
                    <RenderHtml
                      contentWidth={screenWidth - 60}
                      source={{ html: item.html }}
                    // tagsStyles={htmlStyles}
                    />
                    <View style={styles.imageList}>
                      {item.images.map((imageUrl: string, imgIndex: number) => (
                        <Image
                          key={imgIndex}
                          source={{ uri: imageUrl }}
                          style={styles.detailImage}
                          resizeMode="cover"
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: 300,
  },
  mainContent: {
    paddingHorizontal: 15,
    paddingTop: 32,
    paddingBottom: 50,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 16,
    color: '#103947',
  },
  headerDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#103947',
  },
  itemsContent: {
    gap: 15,
  },
  itemContainer: {
    marginBottom: 15,
  },
  itemCoverImage: {
    width: '100%',
    height: 266,
    borderRadius: 8,
  },
  itemMainContent: {
    marginTop: 24,
  },
  itemTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#103947',
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#103947',
  },
  collapseHeader: {
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  collapseIcon: {
    fontSize: 12,
    color: '#103947',
  },
  collapseDetail: {
    marginTop: 10,
  },
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
    gap: 20,
  },
  detailImage: {
    width: (screenWidth - 70) / 2,
    height: 200,
    borderRadius: 8,
  },
});
// HTML render styles
const htmlStyles = {
  h5: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#103947',
  },
  h6: {
    fontSize: 14,
    marginBottom: 8,
    color: '#103947',
  },
  p: {
    fontSize: 17,
    lineHeight: 25.5,
    marginBottom: 12,
    color: '#103947',
  },
  text: {
    fontSize: 17,
    lineHeight: 25.5,
    color: '#103947',
  },
};
export default PrivateSales;