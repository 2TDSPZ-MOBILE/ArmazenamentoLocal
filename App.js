import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,FlatList } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const[nomeProduto,setNomeProduto]=useState('')
  const[precoProduto,setPrecoProduto]=useState()
  const[listaProdutos,setListaProdutos]=useState([])

  async function Cadastrar(){
      let produtos = [];
      
      //Verificar se há alguma já armazenado no AsyncStorage
      if(await AsyncStorage.getItem("PRODUTOS")!=null){
        produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS")) 
      }

      produtos.push({nome:nomeProduto,preco:precoProduto})
      
      //Salvando os dados no AsyncStorage
      await AsyncStorage.setItem("PRODUTOS",JSON.stringify(produtos))

      alert("PRODUTO CADASTRADO")

      BuscarDados()

  }

  //Função BuscarDados
  async function BuscarDados(){
    const p = await AsyncStorage.getItem("PRODUTOS")
    setListaProdutos(JSON.parse(p))
  }

  return (
    <View style={styles.container}>
      <Text>CADASTRO</Text>
      <TextInput 
        placeholder='Digite o nome do produto'
        style={styles.input}
        value={nomeProduto}
        onChangeText={(value)=>setNomeProduto(value)}
      />
      <TextInputMask 
        type="money"
        placeholder='Digite o preço do produto'
        style={styles.input}
        value={precoProduto}
        onChangeText={(value)=>setPrecoProduto(value)}
        options={{
          unit: '$',
        }}
      />
      
      <TouchableOpacity style={styles.btn} onPress={Cadastrar}>
        <Text style={{color:"white"}}>Salvar</Text>
      </TouchableOpacity>

      <FlatList 
        data={listaProdutos}
        renderItem={({item,indice})=>{
          return(
            <View style={styles.listarFlat}>
              <View>
                <Text>NOME:{item.nome} - PRECO:{item.preco}</Text>
              </View>
            </View>
          )
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{
    borderWidth:1,
    width:300,
    height:50,
    borderRadius:15,
    paddingLeft:10,
    marginTop:10
  },
  btn:{
    borderWidth:1,
    backgroundColor:"blue",
    width:300,
    marginTop:10,
    borderRadius:15,
    height:50,
    justifyContent:"center",
    alignItems:"center"
  },
  listarFlat:{
    borderWidth:1,
    width:300,
    alignItems:"center",
    justifyContent:"center",
    height:50,
    marginVertical:3,
    borderRadius:15
  }

});
