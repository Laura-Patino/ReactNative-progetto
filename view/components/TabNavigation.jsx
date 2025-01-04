import { Pressable, StyleSheet, Text } from "react-native"
import { globalStyles } from '../../styles/global';

export default function TabNavigation(props) {

    return (
        <>
            <Pressable 
                onPress={() => props.onChangeScreen(props.name)}    
                style={({pressed}) => [{backgroundColor: pressed ? '#266926' : '#327432' }, styles.tabNavigation ]}>
                {props.children}
                <Text style={globalStyles.navigationText}>{props.name}</Text>
            </Pressable>
        </>
    );
    
}

const styles = StyleSheet.create({
    tabNavigation: {
        flex:1, 
        alignItems: 'center', 
        paddingVertical: 15,
    }
});