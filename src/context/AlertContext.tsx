import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertConfig = {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
};

type AlertContextType = {
  showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType>({} as AlertContextType);

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<AlertConfig>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (title: string, message?: string, buttons?: AlertButton[]) => {
    setConfig({
      visible: true,
      title: title || 'Alert',
      message: message || '',
      // If no buttons, default to a standard close action button
      buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }],
    });
  };

  const hideAlert = () => {
    setConfig(prev => ({ ...prev, visible: false }));
  };

  // Global patching of both standard alert and Alert.alert
  useEffect(() => {
    // Safely patch global.alert (Hermes has a read-only getter for alert)
    try {
      Object.defineProperty(global, 'alert', {
        value: (message: any) => {
          showAlert('Info', String(message));
        },
        writable: true,
        configurable: true,
      });
    } catch (e) {
      console.warn('Could not override global.alert:', e);
    }

    // Patch React Native's Alert.alert
    const originalAlert = Alert.alert;
    Alert.alert = (title: string, message?: string, buttons?: any[]) => {
      showAlert(title, message, buttons);
    };

    return () => {
      // Restore on unmount
      Alert.alert = originalAlert;
    };
  }, []);

  const handleButtonPress = (btn: AlertButton) => {
    hideAlert();
    if (btn.onPress) {
      // Delay slightly to allow modal to close smoothly
      setTimeout(() => {
        btn.onPress?.();
      }, 150);
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      
      <Modal
        visible={config.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideAlert}
      >
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <Text style={styles.title}>{config.title}</Text>
            {config.message ? <Text style={styles.message}>{config.message}</Text> : null}
            
            <View style={[
              styles.buttonContainer,
              config.buttons && config.buttons.length > 2 && styles.buttonContainerStacked
            ]}>
              {config.buttons?.map((btn, index) => {
                const isCancel = btn.style === 'cancel' || btn.text.toLowerCase() === 'cancel';
                const isDestructive = btn.style === 'destructive';
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      isCancel ? styles.cancelButton : styles.confirmButton,
                      isDestructive && styles.destructiveButton,
                      config.buttons && config.buttons.length > 2 && styles.buttonStacked
                    ]}
                    onPress={() => handleButtonPress(btn)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      isCancel ? styles.cancelButtonText : styles.confirmButtonText,
                      isDestructive && styles.destructiveButtonText
                    ]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#121214', // Solid dark gray charcoal matching BelleVie design
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  buttonContainerStacked: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStacked: {
    flex: 0,
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#FFFFFF', // White background matching premium button style
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
  },
  confirmButtonText: {
    color: '#000000', // Black bold text
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
