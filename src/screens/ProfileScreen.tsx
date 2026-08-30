import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { useFilterStore } from '@/stores/filterStore';
import { colors } from '@/theme/colors';
import type { User } from '@/types';
import { styles } from './ProfileScreen.styles';

// タブ設定の型
interface TabSetting {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  enabled: boolean;
  required?: boolean; // 必須タブは無効化不可
}

// 利用可能なタブ一覧
const availableTabs: TabSetting[] = [
  {
    id: 'Calendar',
    label: 'カレンダー',
    icon: 'calendar-outline',
    enabled: true,
    required: true,
  },
  { id: 'Menu', label: '献立', icon: 'restaurant-outline', enabled: true },
  { id: 'Budget', label: '家計簿', icon: 'wallet-outline', enabled: true },
  { id: 'Schedule', label: '予定', icon: 'time-outline', enabled: true },
  { id: 'Stock', label: '在庫', icon: 'cube-outline', enabled: false },
  { id: 'Todo', label: 'Todo', icon: 'checkbox-outline', enabled: false },
  { id: 'Diary', label: '日記', icon: 'book-outline', enabled: false },
  {
    id: 'Messages',
    label: 'メッセージ',
    icon: 'chatbubbles-outline',
    enabled: false,
  },
];

// 初期の家族メンバー
const initialMembers: User[] = [
  { id: 'user-1', name: 'パパ' },
  { id: 'user-2', name: 'ママ' },
  { id: 'user-3', name: '太郎' },
];

export const ProfileScreen: React.FC = () => {
  const [tabs, setTabs] = useState(availableTabs);
  const [familyMembers, setFamilyMembers] = useState<User[]>(initialMembers);
  const [newMemberName, setNewMemberName] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);

  const { quickFilterUserIds, toggleQuickFilterUser } = useFilterStore();
  const logout = useAuthStore((state) => state.logout);

  // 通知設定
  const [notifyMenuUpdate, setNotifyMenuUpdate] = useState(true);
  const [notifyShoppingUpdate, setNotifyShoppingUpdate] = useState(true);
  const [notifyMemberChange, setNotifyMemberChange] = useState(false);

  // アカウント設定
  const [email] = useState('example@email.com');

  // ボトムシート
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%'], []);

  const handleOpenGroupSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleCloseGroupSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // アカウント情報
  const [userName, setUserName] = useState('パパ');
  const [groupName, setGroupName] = useState('田中家');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [tempUserName, setTempUserName] = useState('');
  const [tempGroupName, setTempGroupName] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('権限が必要です', '画像を選択するにはカメラロールへのアクセス許可が必要です');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarImage(result.assets[0].uri);
    }
  };

  const startEditUserName = () => {
    setTempUserName(userName);
    setIsEditingUserName(true);
  };

  const saveUserName = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName.trim());
    }
    setIsEditingUserName(false);
  };

  const startEditGroupName = () => {
    setTempGroupName(groupName);
    setIsEditingGroupName(true);
  };

  const saveGroupName = () => {
    if (tempGroupName.trim()) {
      setGroupName(tempGroupName.trim());
    }
    setIsEditingGroupName(false);
  };

  const toggleTab = (id: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id && !tab.required ? { ...tab, enabled: !tab.enabled } : tab)),
    );
  };

  const enabledCount = tabs.filter((t) => t.enabled).length;

  const addMember = () => {
    if (newMemberName.trim()) {
      const newMember: User = {
        id: `user-${Date.now()}`,
        name: newMemberName.trim(),
      };
      setFamilyMembers((prev) => [...prev, newMember]);
      setNewMemberName('');
      setIsAddingMember(false);
    }
  };

  const removeMember = (member: User) => {
    Alert.alert('メンバーを除外', `${member.name}さんを家族グループから除外しますか？`, [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '除外する',
        style: 'destructive',
        onPress: () => {
          setFamilyMembers((prev) => prev.filter((m) => m.id !== member.id));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              {avatarImage ? (
                <Image source={{ uri: avatarImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Ionicons name="person" size={40} color={colors.background} />
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={14} color={colors.background} />
              </View>
            </TouchableOpacity>

            {isEditingUserName ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={tempUserName}
                  onChangeText={setTempUserName}
                  autoFocus
                  selectTextOnFocus
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity
                    style={styles.editCancelButton}
                    onPress={() => setIsEditingUserName(false)}
                  >
                    <Ionicons name="close" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editSaveButton} onPress={saveUserName}>
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.editableField} onPress={startEditUserName}>
                <Text style={styles.userName}>{userName}</Text>
                <Ionicons name="pencil" size={16} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>グループ設定</Text>
          <TouchableOpacity style={styles.groupCard} onPress={handleOpenGroupSheet}>
            <View style={styles.groupIcon}>
              <Ionicons name="people" size={24} color={colors.primary} />
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupNameText}>{groupName}</Text>
              <Text style={styles.groupMemberCount}>{familyMembers.length}人のメンバー</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>クイックフィルターに表示</Text>
          <Text style={styles.sectionDescription}>
            カレンダー下部のフィルターに表示するメンバーを選択
          </Text>

          <View style={styles.tabList}>
            {familyMembers.map((member) => {
              const isInQuickFilter = quickFilterUserIds.includes(member.id);
              return (
                <View key={member.id} style={styles.tabItem}>
                  <View style={styles.tabInfo}>
                    <View
                      style={[
                        styles.memberAvatarSmall,
                        !isInQuickFilter && styles.memberAvatarDisabled,
                      ]}
                    >
                      <Ionicons name="person" size={16} color={colors.background} />
                    </View>
                    <Text style={[styles.tabLabel, !isInQuickFilter && styles.tabLabelDisabled]}>
                      {member.name}
                    </Text>
                  </View>
                  <Switch
                    value={isInQuickFilter}
                    onValueChange={() => toggleQuickFilterUser(member.id)}
                    trackColor={{ false: colors.border, true: colors.primaryLight }}
                    thumbColor={isInQuickFilter ? colors.primary : colors.textLight}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>フッタータブの表示設定</Text>
          <Text style={styles.sectionDescription}>
            表示するタブを選択してください（最大5つまで推奨）
          </Text>

          <View style={styles.tabList}>
            {tabs.map((tab) => (
              <View key={tab.id} style={styles.tabItem}>
                <View style={styles.tabInfo}>
                  <Ionicons
                    name={tab.icon}
                    size={24}
                    color={tab.enabled ? colors.primary : colors.textLight}
                  />
                  <Text style={[styles.tabLabel, !tab.enabled && styles.tabLabelDisabled]}>
                    {tab.label}
                  </Text>
                  {tab.required && <Text style={styles.requiredBadge}>必須</Text>}
                </View>
                <Switch
                  value={tab.enabled}
                  onValueChange={() => toggleTab(tab.id)}
                  disabled={tab.required}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={tab.enabled ? colors.primary : colors.textLight}
                />
              </View>
            ))}
          </View>

          <Text style={styles.enabledCount}>現在 {enabledCount} 個のタブが有効です</Text>
        </View>
        {/* アカウント設定セクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アカウント設定</Text>

          <View style={styles.settingList}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('メールアドレス変更', 'この機能は今後実装予定です。')}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="mail-outline" size={22} color={colors.primary} />
                <View>
                  <Text style={styles.settingLabel}>メールアドレス</Text>
                  <Text style={styles.settingValue}>{email}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('パスワード変更', 'この機能は今後実装予定です。')}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="lock-closed-outline" size={22} color={colors.primary} />
                <Text style={styles.settingLabel}>パスワード変更</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() =>
                Alert.alert('ログアウト', 'ログアウトしますか？', [
                  { text: 'キャンセル', style: 'cancel' },
                  {
                    text: 'ログアウト',
                    style: 'destructive',
                    onPress: () => logout(),
                  },
                ])
              }
            >
              <View style={styles.settingInfo}>
                <Ionicons name="log-out-outline" size={22} color={colors.error} />
                <Text style={[styles.settingLabel, { color: colors.error }]}>ログアウト</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 通知設定セクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知設定</Text>

          <View style={styles.tabList}>
            <View style={styles.tabItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="restaurant-outline" size={22} color={colors.primary} />
                <Text style={styles.tabLabel}>献立の更新通知</Text>
              </View>
              <Switch
                value={notifyMenuUpdate}
                onValueChange={setNotifyMenuUpdate}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notifyMenuUpdate ? colors.primary : colors.textLight}
              />
            </View>

            <View style={styles.tabItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="cart-outline" size={22} color={colors.primary} />
                <Text style={styles.tabLabel}>買い物リストの更新通知</Text>
              </View>
              <Switch
                value={notifyShoppingUpdate}
                onValueChange={setNotifyShoppingUpdate}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notifyShoppingUpdate ? colors.primary : colors.textLight}
              />
            </View>

            <View style={styles.tabItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="people-outline" size={22} color={colors.primary} />
                <Text style={styles.tabLabel}>家族メンバーの変更通知</Text>
              </View>
              <Switch
                value={notifyMemberChange}
                onValueChange={setNotifyMemberChange}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notifyMemberChange ? colors.primary : colors.textLight}
              />
            </View>
          </View>
        </View>

        {/* データ管理セクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>データ管理</Text>

          <View style={styles.settingList}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() =>
                Alert.alert('キャッシュクリア', 'キャッシュデータを削除しますか？', [
                  { text: 'キャンセル', style: 'cancel' },
                  {
                    text: '削除する',
                    style: 'destructive',
                    onPress: () => Alert.alert('キャッシュを削除しました（モック）'),
                  },
                ])
              }
            >
              <View style={styles.settingInfo}>
                <Ionicons name="trash-outline" size={22} color={colors.primary} />
                <Text style={styles.settingLabel}>キャッシュクリア</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('データのエクスポート', 'この機能は今後実装予定です。')}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="download-outline" size={22} color={colors.primary} />
                <Text style={styles.settingLabel}>データのエクスポート</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* アプリ情報セクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリ情報</Text>

          <View style={styles.settingList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
                <Text style={styles.settingLabel}>バージョン</Text>
              </View>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('利用規約', 'この機能は今後実装予定です。')}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="document-text-outline" size={22} color={colors.primary} />
                <Text style={styles.settingLabel}>利用規約</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('プライバシーポリシー', 'この機能は今後実装予定です。')}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
                <Text style={styles.settingLabel}>プライバシーポリシー</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerItem}
              onPress={() =>
                Alert.alert(
                  'アカウント削除',
                  'アカウントを削除すると、すべてのデータが失われます。この操作は取り消せません。',
                  [
                    { text: 'キャンセル', style: 'cancel' },
                    {
                      text: '削除する',
                      style: 'destructive',
                      onPress: () => Alert.alert('アカウントを削除しました（モック）'),
                    },
                  ],
                )
              }
            >
              <View style={styles.settingInfo}>
                <Ionicons name="warning-outline" size={22} color={colors.error} />
                <Text style={[styles.settingLabel, { color: colors.error }]}>アカウント削除</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.note}>※ 設定の保存機能は今後実装予定です</Text>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>グループ設定</Text>
          <TouchableOpacity onPress={handleCloseGroupSheet} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <View style={styles.sheetSection}>
            <Text style={styles.sheetSectionTitle}>グループ名</Text>
            {isEditingGroupName ? (
              <View style={styles.groupEditContainer}>
                <TextInput
                  style={styles.groupEditInput}
                  value={tempGroupName}
                  onChangeText={setTempGroupName}
                  autoFocus
                  selectTextOnFocus
                />
                <TouchableOpacity onPress={() => setIsEditingGroupName(false)}>
                  <Ionicons name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={saveGroupName}>
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.editableRow} onPress={startEditGroupName}>
                <Text style={styles.editableText}>{groupName}</Text>
                <Ionicons name="pencil" size={18} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.sheetSectionLast}>
            <View style={styles.sheetSectionHeader}>
              <Text style={styles.sheetSectionTitle}>家族メンバー</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingMember(true)}>
                <Ionicons name="person-add" size={18} color={colors.primary} />
                <Text style={styles.addButtonText}>追加</Text>
              </TouchableOpacity>
            </View>

            {isAddingMember && (
              <View style={styles.addMemberForm}>
                <TextInput
                  style={styles.input}
                  placeholder="名前を入力"
                  value={newMemberName}
                  onChangeText={setNewMemberName}
                  autoFocus
                />
                <View style={styles.addMemberButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setIsAddingMember(false);
                      setNewMemberName('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>キャンセル</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      !newMemberName.trim() && styles.confirmButtonDisabled,
                    ]}
                    onPress={addMember}
                    disabled={!newMemberName.trim()}
                  >
                    <Text style={styles.confirmButtonText}>追加する</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.memberList}>
              {familyMembers.map((member, index) => (
                <View key={member.id} style={styles.memberItem}>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberAvatar}>
                      <Ionicons name="person" size={20} color={colors.background} />
                    </View>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {index === 0 && <Text style={styles.ownerBadge}>管理者</Text>}
                  </View>
                  {index !== 0 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeMember(member)}
                    >
                      <Ionicons name="close-circle" size={24} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.inviteButton}>
              <Ionicons name="link" size={18} color={colors.primary} />
              <Text style={styles.inviteButtonText}>招待リンクをコピー</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};
