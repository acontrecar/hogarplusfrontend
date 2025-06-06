import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MotiViewCustom } from '../../../ui/components/MotiViewCustom';
import { HomesDropDown } from '../../../ui/components/HomesDropDown';
import { useEffect, useMemo, useState } from 'react';
import { HomeAndMembers } from '../../../infraestructure/interfaces/home/home.interfaces';
import { useHomeStore } from '../../../store/useHomeStore';
import colors from '../../../constants/colors';
import { CheckBox } from 'react-native-elements';
import { AnimatedButtonCustom } from '../../../ui/components/AnimatedButtonCustom';
import ToastService from '../../../services/ToastService';
import { CreateTaskDto } from '../../../infraestructure/interfaces/calendar/calendar';
import { CreateDebtsDto } from '../../../infraestructure/interfaces/debts/debts.interfaces';
import { useDebtStore } from '../../../store/useDebtsStore';
import { FadeIn, FadeOut, LinearTransition, default as Reanimated } from 'react-native-reanimated';

interface DebtForm {
  description: string;
  amount: string;
  affectedMemberIds: number[];
  homeId: number;
}

interface DebtFormErrors {
  description: string;
  amount: string;
  members: string;
}

export default function DebtsScreen() {
  const [currentHouse, setCurrentHouse] = useState<HomeAndMembers | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<DebtForm>({
    description: 'Prueba desde movil',
    amount: '34',
    affectedMemberIds: [],
    homeId: 0
  });
  const [errors, setErrors] = useState<DebtFormErrors>({
    description: '',
    amount: '',
    members: ''
  });

  const { housesAndMembers, getHomesAndMembers } = useHomeStore();
  const { createDebt } = useDebtStore();

  useEffect(() => {
    clearForms();
  }, [currentHouse]);

  const toggleMember = (memberId: number) => {
    const newSelection = form.affectedMemberIds.includes(memberId)
      ? form.affectedMemberIds.filter(id => id !== memberId)
      : [...form.affectedMemberIds, memberId];

    console.log('newSelection', newSelection);

    setForm({ ...form, affectedMemberIds: newSelection });
    if (newSelection.length > 0 && errors.members && errors.members.length > 0) {
      setErrors({ ...errors, members: '' });
    }
  };

  const formatAmountInput = (text: string, currentValue: string): string => {
    if (text === '') return '';

    let formatted = text.replace(/\s/g, '').replace(/[^0-9.,]/g, '');

    formatted = formatted.replace(/,/g, '.');

    const dotCount = (formatted.match(/\./g) || []).length;
    if (dotCount > 1) {
      const firstDotIndex = formatted.indexOf('.');
      formatted = formatted.substring(0, firstDotIndex + 1) + formatted.substring(firstDotIndex + 1).replace(/\./g, '');
    }

    if (formatted.startsWith('.')) {
      formatted = '0' + formatted;
    }

    const parts = formatted.split('.');
    if (parts.length === 2 && parts[1].length > 2) {
      formatted = parts[0] + '.' + parts[1].substring(0, 2);
    }

    if (formatted.length > 1 && formatted.startsWith('0') && !formatted.startsWith('0.')) {
      formatted = formatted.replace(/^0+/, '');
      if (formatted === '') formatted = '0';
    }

    const numValue = parseFloat(formatted);
    if (formatted !== '' && (isNaN(numValue) || numValue < 0)) {
      return currentValue;
    }

    return formatted;
  };

  const validateAmount = (amount: string): boolean => {
    if (!amount || amount === '') return false;
    const numValue = parseFloat(amount);
    return !isNaN(numValue) && numValue > 0 && numValue <= 999999.99;
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
    } else if (!validateAmount(form.amount)) {
      newErrors.amount = 'Debe ser un número válido mayor a 0 y menor a 999,999.99';
      isValid = false;
    }
    if (form.affectedMemberIds.length === 0) {
      newErrors.members = 'Debe seleccionar al menos un afectado';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const clearForms = () => {
    setForm({
      description: '',
      amount: '',
      affectedMemberIds: [],
      homeId: currentHouse?.id ?? 0
    });
    setErrors({
      description: '',
      amount: '',
      members: ''
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      ToastService.error('Error', 'Por favor complete todos los campos correctamente');
      return;
    }
    setIsSubmitting(true);

    const debt: CreateDebtsDto = {
      description: form.description,
      amount: Number(form.amount),
      affectedMemberIds: form.affectedMemberIds,
      homeId: currentHouse ? currentHouse.id : 0
    };

    console.log('debt', JSON.stringify(debt, null, 2));

    const success = await createDebt(debt);

    if (success) {
      ToastService.success('Deuda creada', 'Deuda creada correctamente');
      clearForms();
    } else {
      ToastService.error('Error', 'No se pudo crear la deuda');
    }

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
          showsVerticalScrollIndicator={false}
        >
          <Reanimated.View
            layout={LinearTransition}
            entering={FadeIn}
            exiting={FadeOut}
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
                  const formattedAmount = formatAmountInput(text, form.amount);
                  setForm({ ...form, amount: formattedAmount });
                  if (errors.amount) setErrors({ ...errors, amount: '' });
                }}
                style={[styles.input, errors.amount && styles.inputError]}
                maxLength={10}
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
                  checked={form.affectedMemberIds.includes(member.id)}
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
                disabled={isSubmitting}
              />
            </View>
          </Reanimated.View>
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
