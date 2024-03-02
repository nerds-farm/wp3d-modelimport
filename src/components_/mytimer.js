import { useState, useEffect } from "react";
function myTimer(prop) {
 const [count, setCount] = useState(0);
  
  useEffect(() => {
      setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
  },[]);

  return (
  <h2>Conta fino a {count}!</h2>
  )
}

export default myTimer;
