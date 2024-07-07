//#### tarea -prueba desafio del cambio de moneda usando api Enrique Paillavil 07-Julio-2024 ######
let myChart; 
// ########### funciones asociada al grafico  ###########
async function getAndCreateDataToChart(divisa_API) {
    try {
      const res = await fetch(`https://mindicador.cl/api/${divisa_API}`);
      const divisa = await res.json();
      const ultimosDiezDias = divisa.serie.slice(0, 10).reverse();
      const labels = ultimosDiezDias.map((dia) => {
        return dia.fecha;
      });
  
      const data = ultimosDiezDias.map((dia) => {
        const valor = dia.valor;
        return Number(valor);
      });
  
      const datasets = [
        {
          label: `"${divisa_API}"`,
          borderColor: "rgb(255, 99, 132)",
          data
        }
      ];
      return { labels, datasets };
    } catch (error) {
      console.error("Error al obtener y crear los datos para la gráfica:", error);

    }
  }
// ######### otra funcion asociada al gráfico ###########
async function renderGrafica(divisa_API) {
  const data = await getAndCreateDataToChart(divisa_API);

  if (myChart) { 
    myChart.data.labels = data.labels;
    myChart.data.datasets[0].data = data.datasets[0].data;
    myChart.data.datasets[0].label = `"${divisa_API}"`;
    myChart.update();
  } else { // cuando no existe una instancia del gráfico, la crea
    const config = {
      type: "line",
      data: {
        labels: data.labels,
        datasets: data.datasets
      }
    };
    const myChartElement = document.getElementById("myChart");
    myChartElement.style.backgroundColor = "white";
    myChart = new Chart(myChartElement, config);
  }
}

//############# funcion principal de conversion ##################
async function mostrar_Conversion(tipoDivisa, divisa_API, monto) {
    try {
      const response = await fetch(`https://mindicador.cl/api/${divisa_API}`);
      const data = await response.json();
  
      // Obtiene el valor moneda mas actual del arreglo
      const ultimoValor = data.serie[0].valor;
      // Calcula la transofrmacion a moneda extrangera
      const montoEnMoneda = monto / ultimoValor;
      // Muestra el valor de la moneda en el input
      const resultInput = document.getElementById("result");
      resultInput.value = `${montoEnMoneda.toFixed(2)} ${tipoDivisa}`;
      // Actualiza la gráfica
      renderGrafica(divisa_API);
    } catch (error) {
      console.error(`Error al obtener el valor del ${tipoDivisa}:`, error);
    }
  }

// funcion con evento click al botón - - - mejorar con enter 
const boton = document.getElementById("boton-dolar");
boton.addEventListener("click", () => {
  const eleccion_Divisa = document.getElementById("from-currency");
  const Divisa_elegida = eleccion_Divisa.value;
  let divisa_API;
  if (Divisa_elegida === "USD") {
    divisa_API = "dolar";
  } else if (Divisa_elegida === "EUR") {
    divisa_API = "euro";
  }
  const montoInput = document.getElementById("monto");
  const monto = parseFloat(montoInput.value);
  mostrar_Conversion(Divisa_elegida, divisa_API, monto);
});

