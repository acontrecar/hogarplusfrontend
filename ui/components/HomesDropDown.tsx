import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { HomeAndMembers } from '../../infraestructure/interfaces/home/home.interfaces';
import { useHomeStore } from '../../store/useHomeStore';

interface Props {
  getHomesAndMembers: () => Promise<boolean>;
  setCurrentHouse: React.Dispatch<React.SetStateAction<HomeAndMembers | null>>;

  currentHouse: HomeAndMembers | null;
  housesAndMembers: HomeAndMembers[] | undefined;
}

export const HomesDropDown = ({ getHomesAndMembers, setCurrentHouse, currentHouse, housesAndMembers }: Props) => {
  const [isFocus, setIsFocus] = useState(false);

  const { setCurrentHome } = useHomeStore();

  const fetchHousesAndMembers = async () => {
    const resp = await getHomesAndMembers();
    if (!resp) {
      console.error('Error fetching houses and members');
      return;
    }
  };

  useEffect(() => {
    fetchHousesAndMembers();
  }, []);

  const renderLabel = () => {
    if (currentHouse || isFocus) {
      return <Text style={[styles.label, isFocus && { color: 'blue' }]}>Seleccione un hogar</Text>;
    }
    return null;
  };

  return (
    <>
      {housesAndMembers ? (
        <View style={styles.container}>
          {renderLabel()}
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }, { width: 200 }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={housesAndMembers}
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={!isFocus ? 'Selecciona el hogar' : '...'}
            searchPlaceholder="Search..."
            value={currentHouse}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={async (item: HomeAndMembers) => {
              setCurrentHouse(item);
              setIsFocus(false);
              setCurrentHome(item);
            }}
            // renderLeftIcon={() => (
            //   <AntDesign
            //     style={styles.icon}
            //     color={isFocus ? "blue" : "black"}
            //     name="Safety"
            //     size={20}
            //   />
            // )}
          />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8
  },
  icon: {
    marginRight: 5
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14
  },
  placeholderStyle: {
    fontSize: 16
  },
  selectedTextStyle: {
    fontSize: 16
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16
  }
});
