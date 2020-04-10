import React, {useState, useEffect} from "react";
import api from './services/api';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(()=>{
      api.get('/repositories').then(response =>{
        return setRepositories(response.data);
      }).catch(err=> console.log(err));
  },[]);

  async function handleLikeRepository(id) {
    try{
      const response = await api.post(`/repositories/${id}/like`);
      const likeRepository = response.data;
      const repositoriesUpdate = repositories.map(repo =>{
        if(repo.id === id){
          return likeRepository;
        }else{
          return repo;
        }
      });
      setRepositories(repositoriesUpdate);
    }catch(err){
      console.log(err);
    }
  }

  async function handleNewRepository(){
    try{
      const response = await api.post('/repositories',{
        url: "https://github.com/IagoChaves",
        title: `New repo ${Date.now()}`,
        techs: ['Node.js','React Native', 'ReactJS']
      });
      setRepositories([...repositories,response.data]);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
      <FlatList 
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({item: repository})=>(
            <View style={styles.repositoryContainer}>
          <Text style={styles.repository}>{repository.title}</Text>

          <View style={styles.techsContainer}>
            {repository.techs.map(tech=>(
              <Text key={tech} style={styles.tech}>
                {tech}
              </Text>
            ))}
           
          </View>

          <View style={styles.likesContainer}>
            <Text
              style={styles.likeText}
              testID={`repository-likes-${repository.id}`}
            >
              {repository.likes} curtidas
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLikeRepository(repository.id)}
            testID={`like-button-${repository.id}`}
          >
            <Text style={styles.buttonText}>Curtir</Text>
          </TouchableOpacity>
        </View>
          )}
        />
        <TouchableOpacity style={styles.addButton}
        activeOpacity={0.6}
        onPress={handleNewRepository}>
          <Text style={styles.addButtonText}>New</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  addButton:{
    margin: 40,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius:4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText:{
    fontWeight: 'bold',
    fontSize: 16
  }
});
