import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

export type ElectronicSealType = 'NONE' | 'MARUIN' | 'KAKUIN' | 'BOTH';

const styles = StyleSheet.create({
  // Container for stamps with subtle vermilion coloring
  sealWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // --- 丸印 (Maruin - Dấu tròn / 代表取締役之印) ---
  maruinOuterCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.2,
    borderColor: '#DC2626',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(254, 242, 242, 0.3)',
    transform: 'rotate(-2deg)',
  },
  maruinInnerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 0.8,
    borderColor: '#DC2626',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  maruinTopCompanyText: {
    position: 'absolute',
    top: 1.5,
    fontSize: 3.5,
    fontWeight: 700,
    color: '#DC2626',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  maruinBottomCompanyText: {
    position: 'absolute',
    bottom: 1.5,
    fontSize: 3.5,
    fontWeight: 700,
    color: '#DC2626',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  maruinCenterText: {
    fontSize: 4.5,
    fontWeight: 700,
    color: '#DC2626',
    textAlign: 'center',
    lineHeight: 1.15,
  },

  // --- 角印 (Kakuin - Dấu vuông / 社印) ---
  kakuinBox: {
    width: 40,
    height: 40,
    borderRadius: 2,
    borderWidth: 1.4,
    borderColor: '#DC2626',
    borderStyle: 'solid',
    padding: 2,
    backgroundColor: 'rgba(254, 242, 242, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotate(1deg)',
  },
  kakuinInnerGrid: {
    flexDirection: 'row-reverse', // Japanese seal reads Right-to-Left
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 2,
  },
  kakuinColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakuinChar: {
    fontSize: 5,
    fontWeight: 700,
    color: '#DC2626',
    lineHeight: 1.15,
    textAlign: 'center',
  },
});

interface SealProps {
  size?: number;
}

/**
 * 丸印 (Maruin - Dấu tròn / 代表取締役印)
 * Chuẩn pháp lý doanh nghiệp Nhật Bản: Vòng ngoài tên công ty, vòng trong chức danh đại diện.
 */
export const MaruinSeal: React.FC<SealProps> = () => {
  return (
    <View style={styles.sealWrapper}>
      <View style={styles.maruinOuterCircle}>
        <Text style={styles.maruinTopCompanyText}>株式会社</Text>
        <View style={styles.maruinInnerCircle}>
          <Text style={styles.maruinCenterText}>代表{"\n"}取締役{"\n"}之印</Text>
        </View>
        <Text style={styles.maruinBottomCompanyText}>ヨシダPKG</Text>
      </View>
    </View>
  );
};

/**
 * 角印 (Kakuin - Dấu vuông / 会社印・社印)
 * Chuẩn chứng từ kế toán Nhật Bản: Bố cục 3 cột dọc từ phải qua trái:
 * Cột 1 (phải): 株式
 * Cột 2 (giữa): 吉田金型
 * Cột 3 (trái): 之印
 */
export const KakuinSeal: React.FC<SealProps> = () => {
  return (
    <View style={styles.sealWrapper}>
      <View style={styles.kakuinBox}>
        <View style={styles.kakuinInnerGrid}>
          {/* Cột 1 (Phải): 株式 */}
          <View style={styles.kakuinColumn}>
            <Text style={styles.kakuinChar}>株</Text>
            <Text style={styles.kakuinChar}>式</Text>
            <Text style={styles.kakuinChar}>会</Text>
            <Text style={styles.kakuinChar}>社</Text>
          </View>
          {/* Cột 2 (Giữa): 吉田金型 */}
          <View style={styles.kakuinColumn}>
            <Text style={styles.kakuinChar}>吉</Text>
            <Text style={styles.kakuinChar}>田</Text>
            <Text style={styles.kakuinChar}>金</Text>
            <Text style={styles.kakuinChar}>型</Text>
          </View>
          {/* Cột 3 (Trái): 工業印 */}
          <View style={styles.kakuinColumn}>
            <Text style={styles.kakuinChar}>工</Text>
            <Text style={styles.kakuinChar}>業</Text>
            <Text style={styles.kakuinChar}>之</Text>
            <Text style={styles.kakuinChar}>印</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
