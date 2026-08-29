import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// ヘッダー(約56) + タブバー(約83) + SafeArea上下(約100)
const CALENDAR_AVAILABLE_HEIGHT = SCREEN_HEIGHT - 56 - 83 - 100;
export const ROW_HEIGHT = Math.floor(CALENDAR_AVAILABLE_HEIGHT / 6);
export const CALENDAR_HEIGHT = ROW_HEIGHT * 6;

// 最大4つまで表示
export const MAX_LABELS = 4;
const WEEKDAY_HEADER_HEIGHT = 36;

export const styles = StyleSheet.create({
  calendarWrapper: {
    flexDirection: 'row',
    height: CALENDAR_HEIGHT,
  },
  weekNumberColumn: {
    width: 28,
    backgroundColor: colors.background,
  },
  weekNumberHeader: {
    height: WEEKDAY_HEADER_HEIGHT,
  },
  weekNumberCell: {
    height: ROW_HEIGHT,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weekNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  calendarContainer: {
    flex: 1,
  },
  calendar: {
    height: CALENDAR_HEIGHT,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 50,
    height: ROW_HEIGHT,
    paddingTop: 2,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayContainerWithLabels: {
    height: ROW_HEIGHT,
  },
  dayNumber: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  dayNumberSelected: {
    backgroundColor: colors.selectedDay,
  },
  dayNumberToday: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
  },
  dayTextDisabled: {
    color: colors.textLight,
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '600',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  labelsContainer: {
    marginTop: 2,
    gap: 1,
    alignItems: 'center',
  },
  label: {
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 2,
    maxWidth: 48,
  },
  labelText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 8,
    color: colors.textSecondary,
    marginTop: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
