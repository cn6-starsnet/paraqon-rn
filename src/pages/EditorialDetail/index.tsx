import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import useEditorialDetail from './useEditorialDetail';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RenderHTML from 'react-native-render-html';
import { pxToVh, pxToVw } from '@/utils/pxToVx';

const EditorialDetailScreen = () => {
  const { post } = useEditorialDetail();
  const insets = useSafeAreaInsets();
  
  if (!post) {
    return (
      <View style={styles.loading}>
        <Text>加载中...</Text>
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={[styles.container, {
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20
      }]}>
        <View style={styles.itemContent}>
            <Text>{ post?.content?.hero.title['cn'] }</Text>
            <RenderHTML 
                source={{
                    html: post?.content?.hero.description['cn']
                }}
            />
        </View>
        <View>
            <Image style={{ width: '100%', height:pxToVh(430) }} source={{
                uri: post?.content?.main.images[0]
            }}/>
            <RenderHTML 
                source={{
                    html: post?.content?.main.footer_text['cn']
                }}
            />
        </View>
        {post.content?.second && <View>
            <View>
                <Text>轮播图位置</Text>
            </View>
            <RenderHTML 
                source={{
                    html: post.content?.second.footer_text['cn']
                }}
            />
        </View>}
        <View>
                <View>
                    <Image style={{ width: '100%', height:pxToVh(800) }} source={{
                        uri: post.content?.third.images[0]
                    }}/>
                </View>
                <View>
                    <RenderHTML 
                        source={{
                            html: post.content?.third.footer_text['cn']
                        }}
                    />
                </View>
        </View>
        <View>
                <View>
                    {post.content?.fourth.cards.map((card,index) => (
                        <View key={index}>
                            <Image style={{ width: '100%', height:pxToVh(800) }} source={{
                                uri: card.image
                            }}/>
                        </View>
                    ))}
                </View>
        </View>
        <View>
            <View>
                <Text>
                    { post.content?.fifth.title.subtitle['cn'] }
                </Text>
                <Text>
                    { post.content?.fifth.title.title['cn'] }
                </Text>
                <Text>
                    { post.content?.fifth.title.description['cn'] }
                </Text>
            </View>
            <View>
                <Image style={{ width: '100%', height:pxToVh(520) }} source={{
                    uri: post.content?.fifth.images[0]
                }}/>
            </View>
            <RenderHTML 
                source={{
                    html: post.content?.fifth.text['cn']
                }}
            />
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: pxToVw(16),
    gap: pxToVh(24)
  },
  itemContent: {
    gap: pxToVh(16)
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
export default EditorialDetailScreen;