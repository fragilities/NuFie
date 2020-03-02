import React, { useEffect, useState } from 'react'
import {View , Text, Image} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../components/FeedsItem'
import { exploreInterest } from '../store/actions/Activity';
import { ScrollView } from 'react-native-gesture-handler';
import loadingSpinner from '../../assets/ball-loading.gif';

export default function CategoryScreen ({ route }) {
    const [ loading, setLoading ] = useState(true);
    let interest = route.params.interest
    const dispatch = useDispatch();
    const listJoinExplore = useSelector(state => state.activity.listByExplore);

    useEffect(() => {
        if(interest === 'Others') {
            interest = interest.slice(0, interest.length - 1)
        }
        dispatch(exploreInterest(interest))
        .then(() => {
            setLoading(false);
        })

        return (() => {
            dispatch({
                type: 'CLEAR_LIST_EXPLORE'
            })
            setLoading(true);
        })
    }, []);

    if(loading) {
        return (<View style={{alignItems: 'center', flex: 1}}>
            <Image source={loadingSpinner} style={{width: 100, height: 100}}/>
            <Text style={{fontSize: 15}}>Fetching data, Please wait....</Text>
          </View>)
    }

    const dataReady = () => {
        return listJoinExplore.map((el) => {
            return <PostCard key={el._id} data={el} routeName={route.name}/>
        })
    }
    return (
        <ScrollView>
            {
                dataReady()
            }
        </ScrollView>
    )
} 