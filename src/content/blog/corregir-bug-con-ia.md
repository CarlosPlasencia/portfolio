---
title: "Cómo corregir un bug con IA sin aceptar la respuesta a ciegas"
author: "Carlos Plasencia · CaleduDev"
draft: false
---

Una respuesta convincente no demuestra que un bug esté resuelto.

La IA puede ayudarte a investigar y proponer cambios. Pero necesitas saber qué debería ocurrir, entender la corrección y comprobar el resultado.

Vamos a practicarlo con una función pequeña de JavaScript. No es un incidente de producción: es un ejemplo que puedes reproducir.

## 1. Define qué debería pasar

Queremos calcular el precio después de aplicar un descuento.

Antes de mirar el código, anotemos algunos resultados esperados:

| Precio | Descuento | Resultado esperado |
|---:|---:|---:|
| 100 | 20 % | 80 |
| 100 | 0 % | 100 |
| 100 | 100 % | 0 |
| 200 | 25 % | 150 |

Estos resultados son nuestra referencia. No deberían cambiar solo porque una herramienta proponga otra implementación.

## 2. Reproduce el fallo

Con Node.js instalado, guarda este ejemplo en un archivo llamado `discount.test.mjs` dentro de una carpeta de práctica:

```js
import test from 'node:test';
import assert from 'node:assert/strict';

function applyDiscount(price, discountPercent) {
  return price * (1 - discountPercent) / 100;
}

const cases = [
  [100, 20, 80],
  [100, 0, 100],
  [100, 100, 0],
  [200, 25, 150],
];

for (const [price, discountPercent, expected] of cases) {
  test(`${price} with ${discountPercent}% off returns ${expected}`, () => {
    assert.equal(applyDiscount(price, discountPercent), expected);
  });
}
```

Ejecuta:

```bash
node --test discount.test.mjs
```

Las cuatro pruebas fallan. En el primer caso, la función devuelve **−19**, cuando debería devolver **80**.

Ya tenemos algo mejor que «el cálculo no funciona»: una entrada concreta, un resultado incorrecto y una expectativa verificable.

## 3. Pide ayuda con contexto

En lugar de escribir «arréglame este código», puedes acompañar el ejemplo con esta petición:

> Esta función debe calcular el precio final después de aplicar un descuento porcentual.
>
> Para un precio de 100 y un descuento de 20, devuelve −19; el resultado esperado es 80.
>
> En este ejercicio asumimos entradas numéricas válidas: precio no negativo y descuento entre 0 y 100.
>
> Explica la causa del fallo y propone el cambio mínimo. Conserva el nombre y los parámetros de la función, no añadas dependencias y no cambies los resultados esperados de las pruebas.

Este prompt no garantiza una respuesta correcta. Lo que hace es delimitar el problema y facilitar la revisión.

Comparte únicamente código que puedas divulgar, sin credenciales ni información privada.

## 4. Entiende la corrección

Una corrección mínima es:

```js
function applyDiscount(price, discountPercent) {
  return price * (1 - discountPercent / 100);
}
```

La diferencia está en los paréntesis.

La versión original calcula:

```text
100 × (1 − 20) ÷ 100 = −19
```

La versión corregida convierte primero el porcentaje en una proporción:

```text
100 × (1 − 20 ÷ 100) = 80
```

No basta con reconocer que el código cambió. Debes poder explicar **por qué ahora representa la regla que necesitas**.

## 5. Comprueba sin mover la meta

Sustituye únicamente la función y ejecuta otra vez el mismo comando.

Con esta corrección, pasan las cuatro pruebas. No hemos modificado las expectativas para acomodarlas a la respuesta.

Eso confirma los casos del ejercicio, no todas las situaciones posibles. Una implementación para dinero real también necesitaría definir validación y una política de precisión y redondeo.

## Qué puedes llevarte a tu próximo bug

El proceso no depende de una herramienta concreta:

**Reproduce → define lo esperado → pide ayuda → entiende el cambio → verifica.**

La IA puede proponer la corrección. Las pruebas y tu revisión aportan evidencia para aceptarla.

**Reto:** añade el caso de un precio de 80 con un descuento del 25 %. Calcula primero el resultado a mano y después escribe la prueba.

*Carlos Plasencia · CaleduDev*

Referencia técnica: el ejemplo utiliza el [ejecutor de pruebas incluido en Node.js](https://nodejs.org/api/test.html), sin instalar paquetes adicionales.
