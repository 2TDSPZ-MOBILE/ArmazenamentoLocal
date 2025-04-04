import { StatusBar } from 'expo-status-bar';
import { useState,useEffect } from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,FlatList } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const[nomeProduto,setNomeProduto]=useState('')
  const[precoProduto,setPrecoProduto]=useState()
  const[listaProdutos,setListaProdutos]=useState([])
  const[produtoEditado,setProdutoEditado]=useState(null)

  useEffect(()=>{
    BuscarDados()
  },[])

  async function Cadastrar(){
      let produtos = [];
      
      //Verificar se há alguma já armazenado no AsyncStorage
      if(await AsyncStorage.getItem("PRODUTOS")!=null){
        produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS")) 
      }

      if(produtoEditado){
          produtos[produtoEditado.index] = {nome:nomeProduto,preco:precoProduto}
      }else{
        produtos.push({nome:nomeProduto,preco:precoProduto})
      }

      
      
      //Salvando os dados no AsyncStorage
      await AsyncStorage.setItem("PRODUTOS",JSON.stringify(produtos))

      alert(produtoEditado?"PRODUTO ATUALIZADO":"PRODUTO CADASTRADO")

      setNomeProduto('')
      setPrecoProduto('')
      setProdutoEditado(null)

      BuscarDados()

  }

  //Função BuscarDados
  async function BuscarDados(){
    const p = await AsyncStorage.getItem("PRODUTOS")
    setListaProdutos(JSON.parse(p))
  }

  async function DeletarProduto(index){
    const tempDados = listaProdutos
    const dados = tempDados.filter((item,ind)=>{
      return ind!==index
    })
    setListaProdutos(dados)
    await AsyncStorage.setItem("PRODUTOS",JSON.stringify(dados))
  }

  function EditarProduto(index){
    const produto = listaProdutos[index]
    setNomeProduto(produto.nome)
    setPrecoProduto(produto.preco)
    setProdutoEditado({index})
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
        <Text style={{color:"white"}}>{produtoEditado?"ATUALIZAR":"SALVAR"}</Text>
      </TouchableOpacity>

      <FlatList 
        data={listaProdutos}
        renderItem={({item,index})=>{
          if(!item || !item.nome) return null;// Garantir q não sejam nulos (item e item.nome)
          return(
            <View style={styles.listarFlat}>
              <View>
                <Text>NOME:{item.nome} - PRECO:{item.preco}</Text>
              </View>
              <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={styles.btnExcluir} onPress={()=>DeletarProduto(index)}>
                  <Text>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnEditar} onPress={()=>EditarProduto(index)}>
                  <Text>Editar</Text>
                </TouchableOpacity>
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
  },
  btnExcluir:{
    backgroundColor:"red",
    width:100,
    borderRadius:15,
    alignItems:"center"
  },
  btnEditar:{
    backgroundColor:"orange",
    width:100,
    borderRadius:15,
    alignItems:"center"
  }

});
