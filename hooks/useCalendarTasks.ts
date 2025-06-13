import { useEffect, useState } from 'react';
import { CalendarUtils } from 'react-native-calendars';
import { Task } from '../infraestructure/interfaces/calendar/calendar';

export const useCalendarTasks = (tasks: Task[]) => {
  const [tasksByDate, setTasksByDate] = useState<{ [key: string]: Task[] }>({});
  const [markedDates, setMarkedDates] = useState<any>({});

  const groupBy = (array: Task[], keyGetter: (item: Task) => string) => {
    const map: { [key: string]: Task[] } = {};
    array.forEach(item => {
      const key = keyGetter(item);
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(item);
    });
    return map;
  };

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const groupedTasks = groupBy(tasks, task => {
        const dateString = task.date.includes('T') ? task.date.split('T')[0] : task.date;

        return CalendarUtils.getCalendarDateString(new Date(dateString));
      });

      setTasksByDate(groupedTasks);

      const newMarkedDates = Object.keys(groupedTasks).reduce((acc, date) => {
        const tasksForDate = groupedTasks[date];
        const highestPriority = tasksForDate.reduce((highest, task) => {
          if (task.priority === 'high') return 'high';
          if (task.priority === 'medium' && highest !== 'high') return 'medium';
          if (highest === 'low' || !highest) return task.priority || 'low';
          return highest;
        }, 'low');

        acc[date] = {
          marked: true,
          dotColor: highestPriority === 'high' ? '#e74c3c' : highestPriority === 'medium' ? '#f39c12' : '#2ecc71'
        };
        return acc;
      }, {} as any);

      setMarkedDates(newMarkedDates);
    } else {
      setTasksByDate({});
      setMarkedDates({});
    }
  }, [tasks]);

  return {
    tasksByDate,
    markedDates
  };
};
