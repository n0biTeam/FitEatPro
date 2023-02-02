import * as React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import { PURINE } from '../styles/colors';


function colorBar(progress, color){
    if(progress <= 50){
      return color = PURINE.P1;
    }else if ((progress >= 51) && (progress <= 150)){
      return color = PURINE.P2;
    }else {
      return color = PURINE.P3;
    }
    
  }
  
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function MyCircle({
    percentage = 0,
    radius = 18,
    strokeWidth = 5,
    duration = 500,
    color = colorBar(percentage),
    delay = 0,
    textColor,
    max = 754 
  }) {
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const circleRef = React.useRef();
    const inputRef = React.useRef();
    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;
   
    
      
  const maxPerc = 100 * percentage / max;
  const strokeDashoffset = circleCircumference - (circleCircumference * maxPerc ) / 100;
      
    return (
      <View>
        <Svg 
          width={radius * 2} 
          height={radius * 2 } 
          viewBox={`0 0 ${halfCircle* 2} ${halfCircle *2}`}
        >
          <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
            <Circle 
              cx='50%'
              cy='50%'
              stroke={color}
              strokeWidth={strokeWidth}
              r={radius}
              fill='transparent'
              strokeOpacity={0.2}
            />
            <AnimatedCircle 
              ref={circleRef}
              cx='50%'
              cy='50%'
              stroke={color}
              strokeWidth={strokeWidth}
              r={radius}
              fill='transparent'
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap='round'
            />
          </G>
        </Svg>
        
        <Text
        underlineColorAndroid="transparent"
        editable={false}
        defaultValue="0"
         style={[
              StyleSheet.absoluteFillObject,
              { fontSize: radius/1.5, color: 'black' },
              { fontWeight: 'bold', textAlign: 'center', marginTop: 10 }
            ]}
        >{percentage}</Text>
      </View>
    )
  }