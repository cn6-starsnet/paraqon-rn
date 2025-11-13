import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { pxToVh, pxToVw } from '@/utils/pxToVx';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getContentBySlug } from '@/store/slices/staticSlice';

const Information: FC = () => {
  const route = useRoute();
  const informationType = route.params?.type || '';
  const [expandedIndex, setExpandedIndex] = useState(null);
  const dispatch = useAppDispatch();

  const informationMap = {
    'how-to-buy': {
      title: '如何购买',
    },
    'how-to-sell': {
      title: '如何出售',
    },
    'terms-and-conditions': {
      title: '条款与协议',
    },
    'privacy-policy': {
      title: '隐私政策',
    },
    'conditions-of-business': {
      title: '买家业务规则',
    },
    'important-notice': {
      title: '重要通知',
    },
    'payment-terms-and-special-fees': {
      title: '付款方式及条款',
    },
    'delivery-and-return': {
      title: '运送与退货',
      questionInfo: [
        {
          questionTitle: '珠宝购买的运输选项有哪些？',
          answer:
            '我们为所有线上珠宝购买提供全球运送。标准运输通常需要5-10个工作日，而快递运输需要2-5个工作日，具体取决于目的地。所有订单在运输过程中均全额投保。',
        },
        {
          questionTitle: '运输费用是多少？',
          answer:
            '运费根据目的地和选择的运输方式而异。标准运输起价为20美元，快递运输起价为50美元。具体费用将在结帐时计算。',
        },
        {
          questionTitle: '你们提供免费运输吗？',
          answer:
            '对于超过500美元的订单，我们为部分目的地提供免费标准运输。请在结帐时查看我们的运输政策以确认资格。',
        },
        {
          questionTitle: '我可以在订单发货后追踪它吗？',
          answer:
            '是的，订单发货后，您将通过电子邮件收到一个追踪号码。您可以使用此号码在我们的网站或运输公司的网站上监控包裹的进度。',
        },
        {
          questionTitle: '你们的珠宝退货政策是什么？',
          answer:
            '我们接受交货后14天内退货，退货的珠宝必须未使用、未损坏并保留原始包装。退款将返还至原始支付方式，不包括运费。请联系我们以启动退货流程。',
        },
        {
          questionTitle: '有哪些商品不能退货？',
          answer:
            '客制化或个人化珠宝以及标有最终销售的商品不可退货。请在购买前仔细查看产品详情。',
        },
        {
          questionTitle: '退货运费由谁承担？',
          answer:
            '除非商品有缺陷或发错，否则退货运费由客户承担。在这种情况下，我们将提供预付退货标签。',
        },
        {
          questionTitle: '退款处理需要多长时间？',
          answer:
            '收到并检查退货商品后，退款通常在5-7个工作日内处理完成。资金可能需要额外时间显示在您的账户中，具体取决于您的支付提供商。',
        },
      ],
    },
  };

  const content = useAppSelector((state) => state.statics.content)

  const notFetchData = ['delivery-and-return'];

  useEffect(() => {
    if (!notFetchData.includes(informationType)) {
      dispatch(getContentBySlug(informationType))
    }
  }, [informationType]);

  const toggleCollapse = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const openExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error('无法打开链接:', url);
      }
    } catch (error) {
      console.error('打开链接失败:', error);
    }
  };

  const currentInfo = informationMap[informationType];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{currentInfo?.title}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Rich Text Content */}
        {!notFetchData.includes(informationType) && content?.info?.cn && (
          <View style={styles.textList}>
            <RenderHtml
              contentWidth={pxToVw(345)} // 屏幕宽度 - padding
              source={{ html: content.info.cn }}
            //   tagsStyles={htmlStyles}
            />
          </View>
        )}

        {/* Delivery and Return Q&A */}
        {informationType === 'delivery-and-return' && (
          <View style={styles.collapseContainer}>
            {currentInfo.questionInfo.map((item, index) => (
              <View key={index} style={styles.collapseItem}>
                {/* Question Header */}
                <TouchableOpacity
                  style={styles.collapseHeader}
                  onPress={() => toggleCollapse(index)}
                >
                  <Text style={styles.questionTitle}>{item.questionTitle}</Text>
                  <Text style={styles.collapseIcon}>
                    {expandedIndex === index ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>

                {/* Answer Content */}
                {expandedIndex === index && (
                  <View style={styles.questionItemList}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: pxToVh(60), // 120rpx ≈ 60px
  },
  headerContent: {
    paddingVertical: pxToVh(36), // 72rpx ≈ 36px
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: pxToVw(24), // 48rpx ≈ 24px
    textAlign: 'center',
    color: '#103947',
  },
  mainContent: {
    paddingHorizontal: pxToVw(15), // 30rpx ≈ 15px
  },
  textList: {
    gap: pxToVh(15), // 30rpx ≈ 15px
  },
  collapseContainer: {
    gap: pxToVh(10),
  },
  collapseItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    paddingVertical: pxToVh(12),
  },
  collapseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: pxToVh(8),
  },
  questionTitle: {
    fontSize: pxToVw(19), // 38rpx ≈ 19px
    lineHeight: pxToVw(28.5), // 1.5 * fontSize
    letterSpacing: 0.03,
    color: '#103947',
    flex: 1,
    paddingRight: pxToVw(10),
  },
  collapseIcon: {
    fontSize: pxToVw(12),
    color: '#103947',
  },
  questionItemList: {
    paddingTop: pxToVh(8),
    paddingRight: pxToVw(48), // 96rpx ≈ 48px
  },
  answerText: {
    fontSize: pxToVw(16), // 32rpx ≈ 16px
    lineHeight: pxToVw(24), // 1.5 * fontSize
    color: '#103947',
  },
});

// HTML render styles
const htmlStyles = {
  p: {
    fontSize: pxToVw(16), // 32rpx ≈ 16px
    lineHeight: pxToVw(19.2), // 1.2 * fontSize
    letterSpacing: 0.03,
    color: '#103947',
    marginBottom: pxToVh(15),
  },
  h1: {
    fontSize: pxToVw(20),
    fontWeight: '600',
    color: '#103947',
    marginBottom: pxToVh(10),
  },
  h2: {
    fontSize: pxToVw(18),
    fontWeight: '600',
    color: '#103947',
    marginBottom: pxToVh(8),
  },
  a: {
    textDecorationLine: 'underline',
    color: '#103947',
  },
};

export default Information;