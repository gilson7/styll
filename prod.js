import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore,collection ,doc, getDoc,orderBy, query, limit,getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyAEvLDOFgYQUSMKqUA0BnqIJghFZS8Ztd0",
    authDomain: "still-afd7d.firebaseapp.com",
    projectId: "still-afd7d",
    storageBucket: "still-afd7d.appspot.com",
    messagingSenderId: "603290036800",
    appId: "1:603290036800:web:7f0a98db0e6e4c366f4da5",
    measurementId: "G-4LDR6GBR2C"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const produtosColec = collection(db, 'produtos');


function obterParametrosDaURL() {
    const queryString = window.location.search;
    const urlSearchParams = new URLSearchParams(queryString);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }
const u = {"dYF": "1","gHY": "2","gJy": "3","ghY": "4","GHy": "5","dyF": "6","FGo": "7","OlI": "8","HiI": '9',};
const parametros = obterParametrosDaURL();
const content = document.getElementById("content");

window.onload = ()=>{
    const documentoRef = doc(produtosColec, parametros.id)
    getProdutos(documentoRef).then(()=>{
        getRandomProducts()
    }) 
    
}

async function getProdutos(ref){
    try {
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            render(docSnap.data())
        } else {
          console.log('Documento não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao recuperar o documento:', error);
        alert("Infelismente Ocorreu um erro ao carregar o conteudo volte mais tarde enquanto resolvemos por aqui")
        removeLoad()
      }
}
async function getRandomProducts(){
    const q = query(produtosColec, orderBy('__name__'), limit(5)); // Ordena pelos IDs dos documentos
    getDocs(q)
    .then((querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
        // Adiciona os documentos à lista
        const obj = doc.data()
        obj.id = doc.id

        documents.push(obj);
        });
        renderRandom(documents)
        // Aqui você tem a lista de documentos limitada e ordenada aleatoriamente
        console.log('Documentos:', documents);
        // Tratamento de sucesso - faça algo com os documentos aqui
    })
    .catch((error) => {
        console.error('Erro ao consultar os documentos:', error);
        // Tratamento de erro - faça algo com o erro aqui
    });
}

function html(type,className){
    const elemento = document.createElement(type)
    elemento.className = className
    return elemento
}
async function render(produto){

    var selectedSize = false
    var selectedColor = produto.variacoes[0].cor
    
    const displayView = html("div","display-view")
    const displayinfo = html("div","display-info")

    const imagem = html("div","view")
    displayView.appendChild(imagem)
   
    

    const fotos = html("div","all-fotos")
    const titulo = html("div","title")
    const cores = html("div","colors")
    ///guardando o ultimo elemento ativo (classe "active")
    var elementActive = ""
    //
    produto.variacoes.map((ele,index)=>{
        const cor = html("div","color") 
        cor.style.backgroundColor = `${ele.hex}`
        if(index==0){
            cor.classList.add("active")
        }
        cor.onclick =()=>{
            changeVariac(index,0)
            elementActive?elementActive.classList.remove("active"):{}
            elementActive = cor
            cor.classList.add("active")
            selectedSize = false
        }
        cores.appendChild(cor)
    })

    const tamanhos = html("div","sizes")
    const comprar = html("div","buy")
    const preco = html("div","price")    
    var fotoButtonActive = ""
    var fotoButtonActiveIndex = 0
    function changeVariac(index,indexFoto){
        fotoButtonActiveIndex = indexFoto
        imagem.style.backgroundImage = `url(${produto.variacoes[index].fotos[indexFoto]})`
        fotos.innerHTML=""
        tamanhos.innerHTML=""
       
        const mapResult = produto.variacoes[index].fotos.map((ele,newIndexFoto)=>{
            const fotoButton = html("div","fotoButton")
            fotoButton.style.backgroundImage=`url(${produto.variacoes[index].fotos[newIndexFoto]}`
            fotoButton.onclick = ()=>{
                changeImage(newIndexFoto)
              
            }
            fotos.appendChild(fotoButton)
            return {fotoButton}
        })
        function changeImage(newIndexFoto){
            fotoButtonActiveIndex  = newIndexFoto
            const fotoButton = mapResult[newIndexFoto].fotoButton
            imagem.style.backgroundImage = `url(${produto.variacoes[index].fotos[newIndexFoto]})`
            fotoButtonActive.classList?.remove("active")
            fotoButton.classList.add("active")
            fotoButtonActive = fotoButton
            if (!verificarUserAgentMobile()) {
                imagem.onclick = ()=>{
                    generateView(produto.variacoes[index].fotos[newIndexFoto])
                }
            }
        }
        changeImage(0)
        var startX= ""
        var currentX = ""

        imagem.ontouchstart = (event)=>{
            imagem.style.transition = "0ms"

            startX = event.touches[0].clientX;
        }   
        imagem.ontouchmove = (event)=>{

            currentX = event.touches[0].clientX - startX;
           
            if (currentX > 10) {
                event.preventDefault()
                if(fotoButtonActiveIndex > 0){
                    imagem.style.backgroundPositionX =currentX+5+"px"
                    if(currentX > 100){
                        imagem.style.backgroundPositionX =currentX+545+"px"
                    }
                }
              
                // Faça algo quando arrastar para a direita
            } else if (currentX < -10) {
                event.preventDefault()
                if(fotoButtonActiveIndex < produto.variacoes[index].fotos.length-1){
                    imagem.style.backgroundPositionX =currentX+-5+"px"
                    if(currentX < -100){
                        imagem.style.backgroundPositionX =-545+"px"
                    }
                }
            }
        }
        imagem.ontouchend = (event)=>{
            event.preventDefault();
            imagem.style.opacity= "20%"
            if (currentX > 100) {
                if(fotoButtonActiveIndex > 0){
                    changeImage(fotoButtonActiveIndex-=1)
                }
                // Faça algo quando arrastar para a direita
            } else if (currentX < -100) {
                if(fotoButtonActiveIndex < produto.variacoes[index].fotos.length-1){
                    changeImage(fotoButtonActiveIndex+1)
                }
            }
            imagem.style.opacity= "100%"
            imagem.style.backgroundPositionX ="center"
        }
        var tamAcitve = ""
        produto.variacoes[index].tamanhos.map((ele)=>{
            const tam = html("div","tam")
            tam.textContent=ele.tamanho.toUpperCase()
            if(parseFloat(ele.estoque)>0){
                tam.onclick = ()=>{
                    selectedSize = ele.tamanho.toUpperCase()
                    selectedColor = produto.variacoes[index].cor
                    tamAcitve.classList?.remove("active")
                    tam.classList.add("active")
                    tamAcitve = tam
                }
            }else{
                tam.style.backgroundColor="gray"
            }
            tamanhos.appendChild(tam)
        })
      
    }

    changeVariac(0,0)
    titulo.innerHTML = produto.title

    const descInfo = html('span','desconto')
    const oldPrecoInfo = html('span','oldPreco')
    const precoInfo = html('span','precoInfo')


    if(parseFloat(produto.desconto)){
        let desconto  = parseFloat(produto.desconto / 100)
        let precobruto = parseFloat(produto.preco)
        let precofinal = precobruto - precobruto*desconto
    
        precoInfo.innerHTML = parseFloat(precofinal,2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        oldPrecoInfo.innerHTML = parseFloat(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        descInfo.innerHTML = produto.desconto+"% "+" OFF"

        preco.appendChild(oldPrecoInfo)
        preco.appendChild(precoInfo)
        preco.appendChild(descInfo)
    }else{
        precoInfo.innerHTML = parseFloat(produto.preco,2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        preco.appendChild(precoInfo)
    }

   


    comprar.innerHTML = "Comprar"
    comprar.onclick = ()=>{
        if(!selectedSize){
            alert("Escolha um tamanho")
            return
        }
        window.open(`https://wa.me/${u["dYF"]+u["FGo"]+u["HiI"]+u["HiI"]+u["FGo"]+u["FGo"]+u["gJy"]+u["GHy"]+u["ghY"]+u["gJy"]+u["HiI"]}?text=
        --Oferta de Compra--%0A
        produto: ${produto.title}%0A
        id: ${produto.id}%0A
        cor: ${selectedColor}%0A
        tamanho :${selectedSize}%0A
        `)  
    }
    //tratar tamnhos e cores

    //
    displayinfo.appendChild(titulo)
    displayinfo.appendChild(preco)
    displayinfo.appendChild(cores)
    displayinfo.appendChild(tamanhos)


    displayinfo.appendChild(comprar)
    displayView.appendChild(fotos)
    content.appendChild(displayView)
    content.appendChild(displayinfo)
    removeLoad()
}
const ramproducts = document.getElementById("recom")
async function renderRandom(produtos){
    produtos.map((prodc)=>{
        const imagem = html("img","prod-img")
        imagem.src = prodc.variacoes[0].fotos[0]
        const title = html("div","prod-title")
        title.textContent = prodc.title
        const price = html("div","prod-price")

        const priceBruto = parseFloat(prodc.preco)
        const desconto = parseFloat(prodc.desconto)/100
        const priceDesc = priceBruto - (priceBruto*desconto)

        if(parseFloat(desconto)){
            const descInfo = html('span','rec-desconto')
            const oldPrecoInfo = html('span','rec-oldPreco')
            const precoInfo = html('span','rec-precoInfo')
            oldPrecoInfo.textContent = priceBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            descInfo.textContent = desconto*100 + "% OFF"
            precoInfo.textContent = priceDesc.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            price.appendChild(oldPrecoInfo)
            price.appendChild(precoInfo)
            price.appendChild(descInfo)
        }else{
            price.textContent = priceBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        }
   
        const prod = html("div","prod-ram")
        prod.appendChild(imagem)
        prod.appendChild(title)
        prod.appendChild(price)
        prod.onclick=()=>{
            window.location.href=`../prod.html?id=${prodc.id}`
        }
        ramproducts.appendChild(prod)
    })

}

function removeLoad(){
    document.getElementById("load").style.display = "none"
}


function generateView(imgUrl){
    const view = html('div','full')
    const closeView = html('div','close-full')
    view.style.backgroundImage = `url(${imgUrl})`
    closeView.textContent = "+"
    view.appendChild(closeView)
    view.onclick = ()=>{
        view.remove()
    }
    document.body.appendChild(view)
}

function verificarUserAgentMobile() {
    // Expressão regular para verificar se o user agent indica um dispositivo móvel
    const regexMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    
    return regexMobile.test(navigator.userAgent);
  }

function sharePopup(){

    const buttonClose = html("div","close-share-popup")
    const sharePopupDiv = html("div","sharePopup")
    const buttonWpp = html("div","share-btt-wpp")
    const linkInput = html("input","share-link")
    const copyLink = html("div","share-button")
    buttonClose.textContent = "+"
    copyLink.textContent = "Copiar"
    linkInput.type = "text"
    linkInput.value = window.location.href
    buttonWpp.textContent = "Enviar pelo whatsApp"
    buttonWpp.onclick = ()=>{
        window.open(`https://api.whatsapp.com/send/?text=${window.location.href}`)
    }
    sharePopupDiv.appendChild(buttonClose)
    
    sharePopupDiv.appendChild(linkInput)
    sharePopupDiv.appendChild(copyLink)
    sharePopupDiv.appendChild(buttonWpp)
    document.body.appendChild(sharePopupDiv)
    buttonClose.onclick = ()=>{
        sharePopupDiv.remove()
    }
    copyLink.onclick = ()=>{
        linkInput.select()
        document.execCommand('copy')
        copyLink.textContent = "copiado"
        setTimeout(()=>{
            copyLink.textContent = "Copiar"
        },3000)

    }
}
document.getElementById("share").onclick = sharePopup