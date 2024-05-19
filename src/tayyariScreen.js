import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions,Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { firebase } from '../config';
import Ionicons from '@expo/vector-icons/FontAwesome';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Modal, Animated } from 'react-native';

const questionImg = require('../assets/tayyari.png');

const TayyariScreen = ({ route }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);


  const flatListRef = useRef(null);

  const { category } = route.params;

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    setSelectedOptions({});
    setShowResults(false);
    const db = firebase.firestore();
    const questionsRef = db.collection('questions');
    const snapshot = await questionsRef.where('category', '==', category).get();
    if (snapshot.empty) {
      console.log('No matching documents..');
      return;
    }
    const allQuestions = snapshot.docs.map(doc => doc.data());
    const shuffleQuestions = allQuestions.sort(() => 0.5 - Math.random());
    setQuestions(shuffleQuestions.slice(0, 10));
  };

  const handleOptionSelect = (questionIndex, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: option,
    });
  };

  const handleSubmit = () => {
    let correctAnswer = 0;
    questions.forEach((questions, index) => {
      if (selectedOptions[index] == questions.correctOption) {
        correctAnswer++;
      }
    });
    setScore(correctAnswer);
    setShowResults(true);
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      flatListRef.current.scrollToIndex({ index, viewPosition: 0.5 });
    }
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(0)).current;


  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.spring(drawerAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(drawerAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={questions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.questionContainer}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
              width: '90%',
              marginVertical: 10,
            }}>
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  backgroundColor: '#ebeef4',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 10,
                }}
                onPress={() => navigateToQuestion(index - 1)}
                disabled={index === 0}
              >
                <EvilIcons name='chevron-left' size={50} color={'#5a5f64'} />
              </TouchableOpacity>

              <Text style={{
                fontSize: 20,
                fontWeight: '500',
                textAlign: 'center',
                color: 'black',
                height: 50,
                lineHeight: 50,
              }}>
                Question {index + 1}
              </Text>

              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  backgroundColor: '#ebeef4',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 10,
                }}
                onPress={() => navigateToQuestion(index + 1)}
                disabled={index === questions.length - 1}
              >
                <EvilIcons name='chevron-right' size={50} color={'#5a5f64'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.question}>
              <Text style={styles.Q}>Q{index + 1}:</Text> {item.question}
            </Text>
            {[item.option1, item.option2, item.option3, item.option4].map(
              (option, optionIndex) => {
                const isSelected = selectedOptions[index] === optionIndex + 1;
                const isCorrect = showResults && item.correctOption === optionIndex + 1;
                const isWrong = showResults && isSelected && !isCorrect;
                return (
                  <TouchableOpacity
                    key={optionIndex}
                    style={[
                      styles.option,
                      isSelected && styles.selectedOptions,
                      isCorrect && styles.correctOption,
                      isWrong && styles.wrongOption,
                    ]}
                    onPress={() => handleOptionSelect(index, optionIndex + 1)}
                    disabled={showResults}
                  >
                    <Text style={[
                      styles.optiontext,
                      isSelected && styles.selectedOptionText,
                      isCorrect && styles.correctOptionText,
                      isWrong && styles.wrongOptionText,
                    ]}>{option}</Text>
                  </TouchableOpacity>
                )
              }
            )}
            {showResults && (
              <View style={styles.result}>
                <Text style={styles.resultText}>
                  You scored {score} out of {questions.length}
                </Text>
                <TouchableOpacity style={styles.tryAgainButton}
                  onPress={getQuestions}>
                  <Text style={styles.tryAgainButtonText}>
                    Try again
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <Modal visible={isDrawerOpen} transparent={true}>
          <View style={styles.backgroundOverlay}>
            <Animated.View style={[styles.drawer, {
              transform: [{
                translateX: drawerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0],
                })
              }]
            }]}>
              <View style={styles.header}>
                <Text style={styles.headerText}>Answer</Text>
                <TouchableOpacity style={styles.crossButton} onPress={toggleDrawer}>
                  <FontAwesome name="close" size={30} color="#5b6065" alignSelf='center' />
                </TouchableOpacity>

              </View>
              <View style={styles.drawerContent}>
                {<TouchableOpacity
                  style={{
                    backgroundColor: "#e1ebfa",

                    marginLeft: 5,
                    marginRight: 5,
                    padding: 10,
                    marginVertical: 0,
                    elevation: 5,
                    borderRadius: 10,
                  }}

                >
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '500'
                  }}>Chemistry</Text>
                 
                </TouchableOpacity>}
                <Text style={{
                    color: '#5b6065',
                    fontSize: 24,
                    fontWeight: 'bold',
                    padding: 10,
                    marginVertical: 0,
                    marginTop:25,
                  }}>Solution Explanation</Text>
                  <Text style={styles.solution}>The ratio of the radius of a cylinder to that of a cone in 2:5. Find the ratio of volume of the cylinder to that of a cone. The ratio of the radius of a cylinder to that of a cone is 2:5. Find the ratio of volume of the cylinder to that of a cone
                  </Text>
                  <Image source={questionImg} style={{width:300 ,height:200,marginTop:20}}/>
              </View>
            </Animated.View>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.checkSolutionButton}
        >
          <Text style={styles.checkSolutionButtonText} onPress={toggleDrawer}>Check solution</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={showResults}
        >
          <Text style={styles.submitButtonText}>Submit answer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TayyariScreen
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionContainer: {
    backgroundColor: 'white',
    width: width,
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  Q: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  question: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 10,
    marginRight: 10,
  },
  solution: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 5,
    marginRight: 5,
  },
  option: {
    marginLeft: 10,
    marginRight: 10,
    padding: 20,
    marginVertical: 8,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
  },
  optiontext: {
    fontSize: 16,
    fontWeight: '400'
  },
  selectedOptions: {
    backgroundColor: '#e1ebfa'
  },
  correctOption: {
    backgroundColor: 'green'
  },
  wrongOption: {
    backgroundColor: '#F84040'
  },
  selectedOptionText: {
    color: 'blue',
  },
  correctOptionText: {
    color: 'white',
  },
  wrongOptionText: {
    color: 'white',
  },
  result: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  tryAgainButton: {
    backgroundColor: '#417df5',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  tryAgainButtonText: {
    color: '#fff',
    fontSize: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 10,
    borderWidth: 0.6,
    borderTopColor: 'grey',
    borderBottomColor: 'white',
    borderRightColor: 'white',
    borderLeftColor: 'white'
  },
  checkSolutionButton: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  checkSolutionButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    fontWeight: '500'
  },
  submitButton: {
    borderRadius: 10,
    backgroundColor: '#417df5',
    padding: 10,
    marginVertical: 10,
  },
  submitButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    fontWeight: '500'
  },
  drawer: {
    width: '75%',
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  drawerContent: {
    flex: 1,
    padding: 20,


  },
  crossButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1001,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 22,
  },

  headerText: {
    color: '#5b6065',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
