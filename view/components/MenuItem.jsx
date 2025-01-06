import { globalStyles } from '../../styles/global';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

//ICONS
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MenuItem({item, onChangeScreen, onMenuSelection}) {

    const onSelectedMenu = (item) => {
        onMenuSelection(item);
        onChangeScreen('Dettagli');
    }

    return (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.imageContainer}>
            <Image source={item?.image ? {uri: item.image} : require('../../assets/images/ImageNotAvailable.jpg')} style={globalStyles.smallImage}/>

        </View>
        <View style={{flex: 2}}>
            <Text style={globalStyles.textNormalBold}>{item?.name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[globalStyles.textSmallRegular]}> € {item?.price} | </Text>
                <Ionicons name="time-outline" size={15} color="black" /> 
                <Text style={[globalStyles.textSmallRegular]}> {item?.deliveryTime} min</Text>
            </View>
            <Text style={[globalStyles.textNormalRegular, {paddingBottom: 15}]}>{item?.shortDescription}</Text>
            <Pressable style={{position: 'absolute', bottom: 0, right: 0}} onPress={() => onSelectedMenu(item?.mid)}>
                <FontAwesome name="arrow-circle-right" size={40} color="brown" />
            </Pressable>
        </View>
        
    </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});