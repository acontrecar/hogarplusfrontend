import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MotiViewCustom } from '../../../ui/components/MotiViewCustom';
import { HomesDropDown } from '../../../ui/components/HomesDropDown';
import { useEffect, useState } from 'react';
import { HomeAndMembers } from '../../../infraestructure/interfaces/home/home.interfaces';
import { useHomeStore } from '../../../store/useHomeStore';
import colors from '../../../constants/colors';
import { CheckBox } from 'react-native-elements';
import { AnimatedButtonCustom } from '../../../ui/components/AnimatedButtonCustom';
import ToastService from '../../../services/ToastService';

interface DebtForm {
  description: string;
  amount: string;
  affectedMembers: number[];
  houseId: number;
}

interface DebtFormErrors {
  description: string;
  amount: string;
  members: string;
}

export default function TasksScreen() {
  const [currentHouse, setCurrentHouse] = useState<HomeAndMembers | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<DebtForm>({
    description: '',
    amount: '',
    affectedMembers: [],
    houseId: 0
  });
  const [errors, setErrors] = useState<DebtFormErrors>({
    description: '',
    amount: '',
    members: ''
  });

  const { housesAndMembers, getHomesAndMembers } = useHomeStore();

  useEffect(() => {
    setForm({
      description: '',
      amount: '',
      affectedMembers: [],
      houseId: currentHouse?.id ?? 0
    });
    setErrors({
      description: '',
      amount: '',
      members: ''
    });
  }, [currentHouse]);

  const toggleMember = (memberId: number) => {
    const newSelection = selectedMemberIds.includes(memberId)
      ? selectedMemberIds.filter(id => id !== memberId)
      : [...selectedMemberIds, memberId];
    setSelectedMemberIds(newSelection);
    if (newSelection.length > 0 && errors.members) {
      setErrors({ ...errors, members: '' });
    }
  };
  const validateForm = () => {
    const newErrors: DebtFormErrors = {
      description: '',
      amount: '',
      members: ''
    };
    let isValid = true;
    if (!form.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
      isValid = false;
    }
    if (!form.amount) {
      newErrors.amount = 'La cantidad es obligatoria';
      isValid = false;
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = 'Debe ser un número válido mayor a 0';
      isValid = false;
    }
    if (selectedMemberIds.length === 0) {
      newErrors.members = 'Debe seleccionar al menos un afectado';
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      ToastService.error('Error', 'Por favor complete todos los campos correctamente');
      return;
    }
    setIsSubmitting(true);
    console.log('selectedMemberIds:', selectedMemberIds);
    setIsSubmitting(false);
  };

  return (
    <MotiViewCustom style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <HomesDropDown
          currentHouse={currentHouse}
          setCurrentHouse={setCurrentHouse}
          getHomesAndMembers={getHomesAndMembers}
          housesAndMembers={housesAndMembers}
        />
      </View>

      {currentHouse && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <View style={styles.formSection}>
            <Text style={styles.label}>Descripcion de la deuda</Text>
            <TextInput
              multiline
              textAlignVertical="top"
              placeholder="Comprar detergente y suavizante"
              value={form.description}
              onChangeText={text => {
                setForm({ ...form, description: text });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              style={[styles.input, errors.description && styles.inputError, { minHeight: 100 }]}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              keyboardType="decimal-pad"
              placeholder="5"
              value={form.amount}
              onChangeText={text => {
                setForm({ ...form, amount: text });
                if (errors.amount) setErrors({ ...errors, amount: '' });
              }}
              style={[styles.input, errors.amount && styles.inputError]}
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Afectados</Text>
            {errors.members && <Text style={styles.errorText}>{errors.members}</Text>}
            {currentHouse.members.map(member => (
              <CheckBox
                key={member.id}
                title={member.name}
                wrapperStyle={styles.input}
                checked={selectedMemberIds.includes(member.id)}
                onPress={() => toggleMember(member.id)}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  padding: 0
                }}
                checkedColor={colors.primary}
                textStyle={{
                  fontSize: 16
                }}
              />
            ))}
          </View>

          <View style={{ alignItems: 'center' }}>
            <AnimatedButtonCustom
              customStyles={{
                backgroundColor: isSubmitting ? colors.primaryLight : colors.primary,
                width: '100%'
              }}
              label={isSubmitting ? 'Creando...' : 'Crear Tarea'}
              onPress={handleSubmit}
              disabled={isSubmitting || !validateForm}
            />
          </View>
        </ScrollView>
      )}
    </MotiViewCustom>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f7fafc',
    marginBottom: 70
  },
  scrollView: {
    width: '100%'
  },
  scrollContent: {
    width: '100%',
    paddingBottom: 20
  },
  formSection: {
    width: '100%',
    marginBottom: 20,
    gap: 10,
    borderRadius: 8,
    borderColor: '#30a6a6',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    padding: 10
  },
  label: {
    fontSize: 18
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#2d3748',
    width: '100%'
  },
  inputError: {
    borderColor: '#e53e3e',
    backgroundColor: '#fff5f5'
  },
  errorText: {
    fontSize: 14,
    color: '#e53e3e',
    marginTop: 4
  }
});
