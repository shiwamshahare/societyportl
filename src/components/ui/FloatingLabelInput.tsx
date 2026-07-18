import React, { forwardRef, useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { DarkTheme } from '../../utils/theme';
import { BORDER_RADIUS } from '../../constants/layout';

export interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelBgColor?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

export const FloatingLabelInput = forwardRef<TextInput, FloatingLabelInputProps>(
  (
    {
      label,
      style,
      containerStyle,
      labelBgColor = DarkTheme.bg.primary,
      leftComponent,
      rightComponent,
      value,
      defaultValue,
      onFocus,
      onBlur,
      onChangeText,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [text, setText] = useState(value || defaultValue || '');

    useEffect(() => {
      if (value !== undefined) {
        setText(value);
      }
    }, [value]);

    const animatedIsFocused = useRef(new Animated.Value(text.length > 0 ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(animatedIsFocused, {
        toValue: isFocused || text.length > 0 ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }, [isFocused, text]);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    const handleChangeText = (newText: string) => {
      setText(newText);
      if (onChangeText) onChangeText(newText);
    };

    // Flatten any styles passed in
    const flattenedStyle = (StyleSheet.flatten(style) || {}) as any;

    // Keys that belong to the container view rather than the text input itself
    const containerKeys = [
      'margin',
      'marginHorizontal',
      'marginVertical',
      'marginTop',
      'marginBottom',
      'marginLeft',
      'marginRight',
      'padding',
      'paddingHorizontal',
      'paddingVertical',
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'height',
      'minHeight',
      'maxHeight',
      'width',
      'minWidth',
      'maxWidth',
      'flex',
      'flexGrow',
      'flexShrink',
      'alignSelf',
      'position',
      'top',
      'bottom',
      'left',
      'right',
      'zIndex',
      'borderWidth',
      'borderColor',
      'borderRadius',
      'borderStyle',
      'borderTopWidth',
      'borderBottomWidth',
      'borderLeftWidth',
      'borderRightWidth',
      'borderTopColor',
      'borderBottomColor',
      'borderLeftColor',
      'borderRightColor',
      'backgroundColor',
    ];

    const extractedContainerStyles: any = {};
    const extractedInputStyles: any = {};

    Object.keys(flattenedStyle).forEach((key) => {
      if (containerKeys.includes(key)) {
        extractedContainerStyles[key] = flattenedStyle[key];
      } else {
        extractedInputStyles[key] = flattenedStyle[key];
      }
    });

    const height = extractedContainerStyles.height || 56;
    const fontSize = extractedInputStyles.fontSize || 16;

    // Calculate vertical alignment for the label
    const startTop = (height - fontSize) / 2;
    const endTop = -fontSize / 2 - 2; // Sit slightly higher than the top border line

    // Calculate label horizontal position based on container padding
    const containerPadding =
      extractedContainerStyles.paddingHorizontal !== undefined
        ? Number(extractedContainerStyles.paddingHorizontal)
        : extractedContainerStyles.padding !== undefined
        ? Number(extractedContainerStyles.padding)
        : 16; // default fallback

    const labelLeft = leftComponent ? (containerPadding + 36) : containerPadding;

    const animatedLabelStyle = {
      top: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [startTop, endTop],
      }),
      fontSize: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [fontSize, fontSize * 0.8],
      }),
      color: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [DarkTheme.text.tertiary, isFocused ? DarkTheme.accent.goldLight : DarkTheme.text.secondary],
      }),
    };

    return (
      <View
        style={[
          styles.container,
          extractedContainerStyles,
          {
            height,
            borderColor: isFocused
              ? DarkTheme.accent.gold
              : extractedContainerStyles.borderColor || DarkTheme.border.input,
          },
          containerStyle,
        ]}
      >
        {/* Animated label floating over the border line */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.labelContainer,
            animatedLabelStyle,
            {
              backgroundColor: labelBgColor,
              left: labelLeft,
            },
          ]}
        >
          <Animated.Text
            style={{
              color: animatedLabelStyle.color,
              fontSize: animatedLabelStyle.fontSize,
              fontWeight: '500',
            }}
          >
            {label}
          </Animated.Text>
        </Animated.View>

        {leftComponent && <View style={styles.leftComponentContainer}>{leftComponent}</View>}

        <TextInput
          {...props}
          ref={ref}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="" // Override placeholder since we are using animated label
          placeholderTextColor="transparent"
          style={[
            styles.textInput,
            {
              fontSize,
              color: DarkTheme.text.primary,
            },
            extractedInputStyles,
          ]}
        />

        {rightComponent && <View style={styles.rightComponentContainer}>{rightComponent}</View>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: DarkTheme.bg.input,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    paddingHorizontal: 6,
    zIndex: 1,
    borderRadius: 4,
  },
  textInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 0,
    color: '#FFFFFF',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  leftComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  rightComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
});
