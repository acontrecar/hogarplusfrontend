import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { HomesByUser, RolHome } from '../../infraestructure/interfaces/home/home.interfaces';
import { HomeCard } from './HomeCard';

interface HomeDisplayProps {
  homes: HomesByUser[];
  icon: ReactNode;
  title: string;
  roll: RolHome;
}

export const HomeDisplay = ({ homes, icon, title, roll }: HomeDisplayProps) => {
  if (homes.length === 0) return null;
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        marginTop: 10
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          paddingBottom: 5,
          borderBottomWidth: 2,
          borderBottomColor: 'black',
          marginBottom: 15
        }}
      >
        {icon}
        <Text style={{ fontSize: 20 }}>{title}</Text>
      </View>

      {homes.map(home => (
        <HomeCard
          key={home.id}
          home={home}
          roll={roll}
        />
      ))}
    </View>
  );
};
