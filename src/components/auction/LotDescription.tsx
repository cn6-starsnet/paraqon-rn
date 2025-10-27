import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { pxToVh, pxToVw, screenWidth } from '@/utils/pxToVx';
import RenderHTML from 'react-native-render-html';

interface LotDescriptionProps {
  auction: {
    contact_info?: {
      name?: {
        cn?: string;
      };
      position?: {
        cn?: string;
      };
      phone?: string;
      email?: string;
    };
  };
  sharing?: any;
  auctionLot?: {
    long_description?: {
      cn?: string;
    };
    attributes?: Array<{
      title: {
        cn?: string;
      };
      value: {
        cn?: string;
      };
    }>;
    documents?: Array<{
      type: string;
      value: string;
    }>;
  };
}

const LotDescription: React.FC<LotDescriptionProps> = ({
  auction,
  sharing,
  auctionLot,
}) => {
  const getDocumentName = (slug: string) => {
    const documentTypes: { [key: string]: string } = {
      'certificate': '证书',
      'appraisal': '鉴定报告',
      'condition-report': '状况报告',
    };
    return documentTypes[slug] || '文档';
  };

  const viewDocument = async (value: string) => {
    try {
      if (value.startsWith('http')) {
        await Linking.openURL(value);
      } else {
        console.log('查看文档:', value);
      }
    } catch (error) {
      console.error('打开文档失败:', error);
    }
  };

  const documents = auctionLot?.documents?.filter((document) => document.value) || [];

  return (
    <View style={styles.container}>
      {documents.length > 0 && (
        <View style={styles.section}>
          {documents.map((document, index) => (
            <View key={index} style={styles.documentItem}>
              <Text style={styles.sectionTitle}>
                {getDocumentName(document.type)}
              </Text>
              <View style={styles.documentAction}>
                <TouchableOpacity
                  style={styles.outlineButton}
                  onPress={() => viewDocument(document.value)}
                >
                  <Text style={styles.outlineButtonText}>
                    查看{getDocumentName(document.type)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>描述</Text>
        <View style={styles.descriptionContent}>
          {auctionLot?.long_description?.cn ? (
            <RenderHTML
              contentWidth={screenWidth - pxToVw(60)}
              source={{ html: auctionLot.long_description.cn }}
              tagsStyles={htmlStyles}
            />
          ) : (
            <Text style={styles.noContentText}>暂无描述</Text>
          )}
        </View>

        {auctionLot?.attributes && auctionLot.attributes.length > 0 && (
          <View style={styles.attributesGrid}>
            {auctionLot.attributes.map((attribute, index) => (
              <View key={index} style={styles.attributeItem}>
                <Text style={styles.attributeTitle}>
                  {attribute.title?.cn || ''}
                </Text>
                <Text style={styles.attributeValue}>
                  {attribute.value?.cn || ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>状况报告</Text>
        <View style={styles.conditionContent}>
          <Text style={styles.conditionText}>
            请联系专家以获取状况报告
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>联系方式</Text>
        {auction?.contact_info && (
          <View style={styles.contactInfo}>
            {auction.contact_info.name?.cn && (
              <Text style={styles.contactText}>
                {auction.contact_info.name.cn}
              </Text>
            )}
            {auction.contact_info.position?.cn && (
              <Text style={styles.contactText}>
                {auction.contact_info.position.cn}
              </Text>
            )}
            {auction.contact_info.phone && (
              <Text style={styles.contactText}>
                {auction.contact_info.phone}
              </Text>
            )}
            {auction.contact_info.email && (
              <Text style={styles.contactText}>
                {auction.contact_info.email}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: pxToVh(12),
  },
  section: {
    gap: pxToVh(8),
  },
  sectionTitle: {
    fontSize: pxToVw(14),
    fontWeight: '600',
    color: '#103947',
    textTransform: 'uppercase',
  },
  documentItem: {
    marginBottom: pxToVh(8),
  },
  documentAction: {
    paddingTop: pxToVh(6),
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#103947',
    borderRadius: pxToVw(4),
    paddingHorizontal: pxToVw(16),
    paddingVertical: pxToVh(8),
    alignSelf: 'flex-start',
  },
  outlineButtonText: {
    fontSize: pxToVw(14),
    color: '#103947',
  },
  descriptionContent: {
    paddingTop: pxToVh(12),
  },
  noContentText: {
    fontSize: pxToVw(14),
    color: '#999',
    fontStyle: 'italic',
  },
  attributesGrid: {
    marginTop: pxToVh(8),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: pxToVw(8),
  },
  attributeItem: {
    width: '48%',
    marginBottom: pxToVh(8),
  },
  attributeTitle: {
    fontSize: pxToVw(12),
    color: '#666',
    marginBottom: pxToVh(4),
  },
  attributeValue: {
    fontSize: pxToVw(14),
    color: '#103947',
    fontWeight: '500',
  },
  conditionContent: {
    paddingTop: pxToVh(12),
  },
  conditionText: {
    fontSize: pxToVw(14),
    color: '#103947',
  },
  contactInfo: {
    paddingTop: pxToVh(12),
    gap: pxToVh(8),
  },
  contactText: {
    fontSize: pxToVw(14),
    color: '#103947',
  },
});

const htmlStyles = {
  p: {
    fontSize: pxToVw(14),
    lineHeight: pxToVw(22.4),
    color: '#103947',
    marginBottom: pxToVh(8),
  },
  div: {
    fontSize: pxToVw(14),
    lineHeight: pxToVw(22.4),
    color: '#103947',
  },
  span: {
    fontSize: pxToVw(14),
    lineHeight: pxToVw(22.4),
    color: '#103947',
  },
};

export default LotDescription;