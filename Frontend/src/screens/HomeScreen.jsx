import Hero from "../components/Hero";
const HomeScreen = () => {
    return (  
        <div>
            <Hero />
            <div className="image-container">
                <img 
                    src="https://basenotes.com/wp-content/themes/bn/images/background2.png" 
                    alt="Background"
                    className="background-image"
                    width="100%"
                    style={{
                        marginTop:"20px"
                    }}
                />
            </div>
        </div>
        
    );
}
 
export default HomeScreen;