import React from 'react';

// Kartenkomponente
const Card = ({data, onClick}) => {
    return(
      <div className='bg-light-green mid-gray ba br4 grow pa2 ma2' onClick={onClick}>
        <img alt="pokemon" src={data[0]} />
        <h2 className='f5'>{data[1]}</h2>
        <p>HP: {data[2]}</p>
        <p>Attack: {data[3]}</p>
        <p>Defense: {data[4]}</p>
      </div>
    );
};

// Endergebnis 10lost -> Game Over
// 10Win -> Winner
const Endergebnis = ({win, lose, tryAgain}) => {
  if(win >= 10 && lose <= 10){
    return(
      <div>
       <h1>Winner!</h1>
       <button className='silver bg-dark-gray pa2 ma3 br3' type="button" onClick={tryAgain}>Again?</button>
      </div>
    );
  }
  else if(lose >= 10 && win <= 10)
  {
    return(
      <div>
        <h1>Game over!</h1>
        <button className='silver bg-dark-gray pa2 ma3 br3' type="button" onClick={tryAgain}>Again?</button>
      </div>
    );
  }
  else{ return (
    <div>
    <button className='silver bg-dark-gray pa2 ma3 br3' type="button" onClick={tryAgain}>Restart</button>
    </div>
  );}
}

// gewählte Karte
const Cardchosed = ({data}) => {
    if(data === 0){
      return(<div className='bg-moon-gray h3 br3 w2 bg pa2 ma2'></div>);
    }else {
      return(
       <div className='bg-lightest-blue mid-gray ba br3 grow pa2 ma2'>
         <img alt="pokemon" src={data[0]} />
         <h2 className='f5'>{data[1]}</h2>
         <p>HP: {data[2]}</p>
         <p>Attack: {data[3]}</p>
         <p>Defense: {data[4]}</p>
       </div>
     );
    }
};

// Spiel
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      card: [1,2,3,4,5,6],
      enemy: 0,
      chosenCard: 0,
      won: 0,
      lost: 0,
      result: ''
    };
  }

  // Hier werden zufällige Karten aus der Pokemon API geladen
  buildCard(i){
    const cardArray = this.state.card;
    const id = Math.floor((Math.random()*800)+1);
    // fetched Daten aus der Pokemon API
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(data => {
        cardArray[i] = [
          data.sprites.front_default,
          data.name,
          data.stats[0].base_stat,
          data.stats[1].base_stat,
          data.stats[2].base_stat,
        ];
        // Einfügen des Datenarrays in card
        this.setState({card: cardArray});
          });
  }

  enemyCard(){
    let cardArray = this.state.enemy;
    const id = Math.floor((Math.random()*800)+1);
    // fetched Daten aus der Pokemon API
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(data => {
        cardArray = [
          data.sprites.front_default,
          data.name,
          data.stats[0].base_stat,
          data.stats[1].base_stat,
          data.stats[2].base_stat,
        ];
        // Einfügen des Datenarrays in card
        this.setState({enemy: cardArray});
          });
  }

  handleClick(i){
    const choose = this.state.card[i];
    this.setState({chosenCard: choose});
    setTimeout(()=> {this.enemyCard();},100);
    setTimeout(()=> {
      this.buildCard(i);
      // Attack/HP_Enemy*Defense_Enemy
      const powerYou = parseInt(choose[3])/(parseInt(this.state.enemy[3])*parseInt(this.state.enemy[4]));
      const powerEnemy = parseInt(this.state.enemy[2])/(parseInt(choose[2])*parseInt(choose[4]));
      // Bei Gewinn/ Verlust eine Ausgabe und dazu den Zählerhochzählen
      if(powerYou > powerEnemy){
        this.setState({
          result: 'You win',
          won: this.state.won+1
        });
      }
      else if(powerEnemy > powerYou){
        this.setState({
          result: 'You lose',
          lost: this.state.lost+1
        });
      }
      else{
        this.setState({result: 'Tie'});
      }
      // Wenn man 10mal gewonnen hat -> gewonnen
      // Ansonsten Game Over
    },1000);
    setTimeout(()=>{
      this.setState({result: ''});
    },100);
  }

  tryAgain(){
    for(let i= 0; i<5; i++){
      this.buildCard(i);
    }
    this.setState({
      enemy: 0,
      chosenCard: 0,
      won: 0,
      lost: 0
    });
  }

  // Wenn die App gemountetd ist, werden die Karten zufällig verteilt
  componentWillMount(){
    for(let i= 0; i<5; i++){
      this.buildCard(i);
    }
  }

  render(){
    const {card, chosenCard, enemy, won, lost, result } = this.state;
    return (
      <div className='w-100 mid-gray tc bg-washed-yellow'>
        <header className='pa1'>
          <h1 className='f1'>Pokemon Cards</h1>
        </header>
        <section className='w-100'>
          <h1>Enemy</h1>
          <div className='flex flex-row flex-wrap justify-center'>
            <div className='bg-light-red h3 w2 bg br3 pa2 ma2'></div>
            <div className='bg-light-red h3 w2 bg br3 pa2 ma2'></div>
            <div className='bg-light-red h3 w2 bg br3 pa2 ma2'></div>
            <div className='bg-light-red h3 w2 bg br3 pa2 ma2'></div>
            <div className='bg-light-red h3 w2 bg br3 pa2 ma2'></div>
          </div>
        </section>
        <hr />
        <section className='flex flex-row justify-center items-center'>
          <Endergebnis win={won} lose={lost} tryAgain={()=>this.tryAgain()}/>
          <Cardchosed data={enemy} />
          <Cardchosed data={chosenCard} />
          <h1>{result}</h1>
        </section>
        <hr />
        <section className='w-100'>
          <h1>Me</h1>
          <div className='flex flex-row flex-wrap justify-center'>
            <div>
              <h2>Lost: {lost}</h2>
              <h2>Won: {won}</h2>
            </div>
            <Card data={card[0]} onClick={()=>this.handleClick(0)} />
            <Card data={card[1]} onClick={()=>this.handleClick(1)} />
            <Card data={card[2]} onClick={()=>this.handleClick(2)} />
            <Card data={card[3]} onClick={()=>this.handleClick(3)} />
            <Card data={card[4]} onClick={()=>this.handleClick(4)} />
          </div>
        </section>
      </div>
    );
  }
}

export default App;
