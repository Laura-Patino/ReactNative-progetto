import { globalStyles } from '../../styles/global';
import { View, Text, Image, Pressable } from 'react-native';

//ICONS
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MenuItem({item}) {
    return (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Image source={item?.image ? {uri: item.image} : require('../../assets/images/ImageNotAvailable.jpg')} style={globalStyles.smallImage}/>
        <View style={{marginLeft: 10, flex: 2}}>
            <Text style={globalStyles.textNormalBold}>{item?.name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[globalStyles.textSmallRegular]}> € {item?.price} | </Text>
                <Ionicons name="time-outline" size={15} color="black" /> 
                <Text style={[globalStyles.textSmallRegular]}> {item?.deliveryTime} min</Text>
            </View>
            <Text style={globalStyles.textNormalRegular}>{item?.shortDescription}</Text>
        </View>
        <Pressable style={{position: 'absolute', bottom: 0, right:15}} onPress={() => console.log('pressed')}>
            <FontAwesome name="arrow-circle-right" size={40} color="brown" />
        </Pressable>
    </View>
    );
};