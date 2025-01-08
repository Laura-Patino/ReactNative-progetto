import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect } from 'react';

export default function ProfileScreen() {
    useEffect(() => {
        console.log('----Profile useEffect----');
    }, []);

    return (
        <View style={{flex: 1}}>
          <View style={{ marginBottom: 10, marginHorizontal:15}}>
              <Text style={globalStyles.headerTitle}>Profilo</Text>
          </View>
          <View style={styles.bodyContent}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text style={globalStyles.textNormalBold}>Profilo</Text>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({ 
  bodyContent: {
    flex:1, 
    backgroundColor: 'white', 
    paddingTop: 10, 
    paddingBottom: 5,
    paddingHorizontal:15, 
    borderTopRightRadius: 15, 
    borderTopLeftRadius: 15
  },
});