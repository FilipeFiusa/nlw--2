import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { View, Image, Text, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage';


import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

function Favorites(){
    const [favorites, setFavorites] = useState([]);

    function loadFavorites(){
        AsyncStorage.getItem('myFavorites').then(response => {
            if( response  ){
                const favoritedTeachers = JSON.parse(response);
                setFavorites(favoritedTeachers);
                console.log(favoritedTeachers)

                setFavorites( favoritedTeachers )
            }
        })
    }

    useFocusEffect(() => {
        loadFavorites();
    });

    return (
        <View style={styles.container}>
            <PageHeader title= "Meus proffys favoritos" />

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >

                {favorites.map((teacher: Teacher) => {
                        return (
                            <TeacherItem 
                                key={teacher.id}
                                teacher={teacher} 
                                favorited={true}
                            />
                        )
                    }
                )}

            </ScrollView> 
        </View>
    )
}

export default Favorites;