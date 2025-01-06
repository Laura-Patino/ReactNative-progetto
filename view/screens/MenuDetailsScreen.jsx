import React, { useEffect } from 'react';
import { View, Text, Image, Pressable, Button } from 'react-native';

export default function MenuDetailsScreen({menu, onChangeScreen}) {
    useEffect(() => {
        console.log('----MenuDetailsScreen useEffect----');
        console.log('\tMenu:', menu);
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Menu Details Screen: {menu}</Text>
            <Button title="Go to Home" onPress={() => onChangeScreen('Home')}/>
        </View>
    );
}
