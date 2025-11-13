import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ExpertServices = ({ route }) => {
  const scrollViewRef = useRef(null);
  const itemRefs = useRef([]);
  const targetIndex = route?.params?.scrollIndex || 0;

  const content = {
    banner_image: "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/a19aad95-1a48-4674-aaea-34a1def55d01.webp",
    contents: [
      {
        image:
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/f94bd2c8-a799-4ae2-9158-3ca18c93023c.webp",
        title: "估价",
        description: `我们的珠宝估价服务为所有类型的珠宝提供全面的评估，从钻石和宝石到黄金和古董珠宝。无论您是想投保、出售，还是只是想了解其价值，我们的专家都将为您提供透明、安全、高效的服务。凭借丰富的宝石学和贸易专业知识，我们评估珠宝时，会专注于其品质、品相和当前市场趋势，以确保客户获得准确、可靠且详细的估价，从而更好地服务于他们的珍爱之物。`,
        btn: {
          text: "预约",
          path: "/contact-us",
        },
      },
      {
        image:
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/jpg/f7df80d8-98c1-41fa-9be2-5d0bc4475fc1.jpg",
        title: "采购",
        description: `我们的珠宝采购服务致力于为最独特的个人收藏找到完美搭配。从稀有宝石和客制化设计，到复古和现代作品，我们经验丰富的专家在复杂的珠宝采购领域游刃有余，同时优先考虑品质、真实性和可持续性，以确保我们交付的每一件作品都符合客户的期望和价值观。凭借我们广泛的可信赖的供应商和工匠网络，我们提供个人化、安全高效的管道，从全球各地采购最精美的珠宝。`,
        btn: {
          text: "预约",
          path: "/contact-us",
        },
      },
      {
        image:
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/2caaf9ff-08c4-4343-87e1-07f2f2641fc4.webp",
        title: "设计和重新设计",
        description: `我们的珠宝设计服务专注于打造订制珠宝，展现您独特的风格，捕捉人生中难忘的时刻。您可以选择从零开始，也可以将心爱之物重新利用。从散石和纸质草图开始，我们致力于以一丝不苟的精准度和细节，将您的愿景变为现实。我们还可以为您现有的珠宝注入新的活力，将旧物融入新的设计中，或彻底改造，以迎合您不断变化的品味。在我们位于香港的工坊中，配备最新的技术和工具，内部设计师与宝石学家和工匠紧密合作，打造引领潮流、品质卓越的珠宝作品，展现您的个人故事和美学偏好。`,
        btn: {
          text: "预约",
          path: "/contact-us",
        },
      },
      {
        image:
          "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/de8a580e-d796-4665-9d02-cd5f019f7ab7.webp",
        title: "融资",
        description: `我们的珠宝融资服务为希望利用珠宝价值来满足财务需求的人士提供安全灵活的解决方案。我们拥有一支经验丰富的专家团队，对您的珠宝进行精准评估，确保您获得公平透明的贷款方案。我们的服务在完全持牌的放贷机构框架下运营，使我们能够以业内极具竞争力的利率提供融资解决方案。无论您是想以珠宝抵押贷款来获得短期流动性，还是考虑利用您的珠宝实现更大的财务目标，我们量身定制的融资方案都将根据您的需求进行设计。我们以专业、保密和提供无缝体验的承诺而自豪，确保您获得所需的支援和合适的条款。`,
        btn: {
          text: "预约",
          path: "/contact-us",
        },
      },
    ],
  }

  useEffect(() => {
    // 页面加载后滚动到目标位置
    if (targetIndex > 0) {
      setTimeout(() => {
        scrollToTarget();
      }, 300);
    }
  }, [targetIndex]);

  const scrollToTarget = () => {
    if (targetIndex > 0 && itemRefs.current[targetIndex - 1]) {
      itemRefs.current[targetIndex - 1].measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current.scrollTo({ y: y - 50, animated: true });
        },
        () => console.log('measure failed')
      );
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: content.banner_image }}
        style={styles.bannerImage}
        resizeMode="cover"
      />

      <View style={styles.mainContent}>
        {content.contents.map((item, index) => (
          <View
            key={index}
            ref={(ref) => (itemRefs.current[index] = ref)}
            style={styles.itemContainer}
          >
            <View style={styles.itemImage}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemCoverImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.itemMainContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>

              <TouchableOpacity>
                <Text style={styles.linkText}>{item.btn.text}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    paddingBottom: 60,
  },
  itemContainer: {
    marginBottom: 32,
  },
  itemImage: {
    marginBottom: 24,
  },
  itemCoverImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  itemMainContent: {
    gap: 16,
  },
  itemTitle: {
    fontSize: 18,
    color: '#103947',
    fontWeight: '500',
    marginBottom: 16,
  },
  itemDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#103947',
    marginBottom: 16,
  },
  linkText: {
    fontSize: 16,
    color: '#103947',
    textDecorationLine: 'underline',
  },
});

export default ExpertServices;