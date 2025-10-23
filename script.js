/**
 * Función para calcular el dígito de control interno del CN (Séptimo dígito).
 * Se aplica a los primeros 6 dígitos del CN.
 * Fórmula: (Suma de impares) + 3 * (Suma de pares) + 27. Calcular la diferencia a la siguiente decena.
 * @param {string} seisDigitosCN - Los primeros 6 dígitos del Código Nacional.
 * @returns {number} El dígito de control (0-9).
 */
function calcularDigitoControlCN(seisDigitosCN) {
    if (seisDigitosCN.length !== 6) return -1; // Error

    let sumaImpares = 0; // Posiciones 1, 3, 5 (Índices 0, 2, 4)
    let sumaPares = 0;   // Posiciones 2, 4, 6 (Índices 1, 3, 5)

    for (let i = 0; i < 6; i++) {
        let digito = parseInt(seisDigitosCN[i]);
        
        // Las posiciones impares del CN (1º, 3º, 5º) tienen índice par (0, 2, 4)
        if (i % 2 === 0) {
            sumaImpares += digito;
        } 
        // Las posiciones pares del CN (2º, 4º, 6º) tienen índice impar (1, 3, 5)
        else {
            sumaPares += digito;
        }
    }

    // 1. Suma de impares
    // 2. Más la suma de los resultados de multiplicar por tres cada uno de los tres dígitos en posición par
    //    (El texto de la fórmula indica: "multiplicar por tres cada uno de los tres dígitos en posición par", 
    //    lo que se interpreta como (digito2*3 + digito4*3 + digito6*3) o 3 * (sumaPares)).
    let sumaTotal = sumaImpares + (3 * sumaPares);

    // 3. Más 27
    sumaTotal += 27;

    // 4. Calcular la diferencia hasta la siguiente decena
    let siguienteDecena = Math.ceil(sumaTotal / 10) * 10;
    
    // El dígito de control es la diferencia entre la siguiente decena y la suma total.
    let digitoControl = siguienteDecena - sumaTotal;
    
    return digitoControl;
}



/**
 * Función principal para generar el GTIN a partir del Código Nacional (CN).
 */
function calcularGTIN() {
    const PREFIJO_BASE = '0847000'; // 84 (España) + 7000 (Farmacia)
    const LONGITUD_CN_BASE = 6;
    
    let cnInput = document.getElementById('codigoNacional').value.trim();
    let cnLimpio = cnInput.replace(/[^0-9]/g, '');

    document.getElementById('codigoNacional').value = cnLimpio;

    const dcResultado = document.getElementById('digitoControlResultado');
    const gtinResultado = document.getElementById('gtinResultado');
    dcResultado.textContent = '—';
    gtinResultado.textContent = '—';
    dcResultado.classList.remove('mensaje-alerta');
    
    // --- LÓGICA DE VALIDACIÓN Y CÁLCULO ---

    if (cnLimpio.length === LONGITUD_CN_BASE) {
        // La longitud es exactamente 6 dígitos.
        
        // 1. Calcular el Dígito de Control Interno (séptimo dígito del CN)
        let dcCN = calcularDigitoControlCN(cnLimpio);
        
        // 2. Formar el CN de 7 dígitos
        let cnCompleto7 = cnLimpio + dcCN;

        // 3. Cadena base de 12 dígitos para el GTIN
        let cadenaBaseGTIN = PREFIJO_BASE + cnLimpio;

        // 4. Calcular el Dígito de Control GTIN (Dígito 13)
        
        // 5. Formar el GTIN completo (EAN-13)
        let gtinCompleto = cadenaBaseGTIN + dcCN;

        // Mostrar los resultados
        dcResultado.textContent = `${dcCN} | CN Completo: ${cnCompleto7}`;
        gtinResultado.textContent = gtinCompleto;
        
    } else if (cnLimpio.length > 0) {
        // Si la longitud es incorrecta (pero hay dígitos)
        dcResultado.textContent = `Faltan ${LONGITUD_CN_BASE - cnLimpio.length} dígitos.`;
        dcResultado.classList.add('mensaje-alerta');

    }
    // Si el campo está vacío, se queda en "—"
    }
