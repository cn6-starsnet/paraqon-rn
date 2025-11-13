import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { pxToVh, pxToVw } from '@/utils/pxToVx';
import { FC } from 'react';

const WrokChance: FC = () => {
  const content = {
    banner_image: "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/e761fac2-cf5b-4d1f-b100-dacc1f804b63.webp",
    title: "加入 PARAQON 大家庭：热情与目标的交汇",
    description: "欢迎来到 PARAQON 的职业发展页面，这里汇聚了创造力、热情和创新，共同塑造高级珠宝的未来。如果您渴望加入一支充满活力、富有远见的团队，我们诚挚邀请您探索公司内部令人兴奋的职涯发展机会。",
    main_image: "https://starsnet-development.oss-cn-hongkong.aliyuncs.com/webp/4b5e31be-109e-4d2a-9394-bd14f55be131.webp",
    bottom_title: "我们的理念：培养人才，成就卓越",
    bottom_description: "在 PARAQON，我们相信我们的成功深深植根于团队的才华、奉献精神和创造力。我们创造一个协作包容的环境，鼓励员工在个人和职业发展方面蓬勃发展。我们正在扩大我们的大家庭，寻求与我们一样追求卓越、对打造恒久之美充满热情的人才。"
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: content.banner_image }}
        style={styles.bannerImage}
        resizeMode="cover"
      />

      <View style={styles.contentMain}>
        <View style={styles.topContent}>
          <Text style={styles.topContentTitle}>{content.title}</Text>
          <Text style={styles.topContentDescription}>{content.description}</Text>
        </View>

        <View style={styles.mainImg}>
          <Image
            source={{ uri: content.main_image }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.bottomContentTitle}>{content.bottom_title}</Text>
          <Text style={styles.bottomContentDescription}>
            {content.bottom_description}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: pxToVh(10),
    paddingBottom: pxToVh(60),
  },
  bannerImage: {
    width: '100%',
    height: pxToVh(300),
  },
  contentMain: {
    paddingHorizontal: pxToVw(15),
    gap: pxToVh(32),
    marginTop: pxToVh(32),
  },
  topContent: {
    gap: pxToVh(16),
    alignItems: 'center',
  },
  topContentTitle: {
    fontSize: pxToVw(20),
    lineHeight: pxToVw(30),
    textAlign: 'center',
    color: '#103947',
  },
  topContentDescription: {
    fontSize: pxToVw(16),
    lineHeight: pxToVw(24),
    textAlign: 'center',
    color: '#103947',
  },
  mainImg: {
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: pxToVh(285),
    borderRadius: 8,
  },
  bottomContent: {
    gap: pxToVh(16),
  },
  bottomContentTitle: {
    fontSize: pxToVw(18),
    lineHeight: pxToVw(27),
    color: '#103947',
  },
  bottomContentDescription: {
    fontSize: pxToVw(16),
    lineHeight: pxToVw(24),
    color: '#103947',
  },
});

export default WrokChance;