import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useRecommendationMutation, useAddToFavouritesMutation } from '../slices/userApiSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';


const Hero = () => {
  const [description, setDescription] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const {userInfo} = useSelector((state) => state.auth)

  const [recommend, { isLoading }] = useRecommendationMutation();
  const [addToFavourites] = useAddToFavouritesMutation();

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    try {
      const res = await recommend({ description }).unwrap();
      console.log(res)
      if (res.recommendations.includes("Please") || res.recommendations.includes("It's")) {
        toast.error("Please provide me with more information about your preferences!");
        return;
      }
      setDescription('');
      setRecommendations(res.recommendations);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleKeyDown = (event) => {
    if (event && event.key === "Enter") {
      handleGetRecommendations(event);
    }
  };

  const handleAddToFavourites = async (perfumeName) => {
    try {
      if(userInfo){
        const res = await addToFavourites({ perfumeName }).unwrap();
        toast.success(res.message, {
          autoClose: 1000,
        });
      }else{
        toast.error("Login to add favourites");
      }
      
    } catch (err) {
      toast.error(err?.data?.message || err.error, {
        autoClose: 1000,
      });
    }
  }

  const renderRecommendations = () => {
    if (!recommendations) return null;

    let formattedRecommendations = recommendations.replace(/^##\s.*\n/gm, '');

    const titleMatch = recommendations.match(/^##\s*(.*)\n/);
    const title = titleMatch ? titleMatch[1] : '';

    const perfumes = formattedRecommendations.split(/\d\.\s+/).slice(1).map((item, index) => {
      const [title, ...details] = item.split('\n').filter(line => line.trim() !== '');
      return { id: index + 1, title, details };
    });

    return (
      <div>
        {title && <h2 style={{ marginBottom: "20px" }}>{title}</h2>}
        <Row>
          {perfumes.map((perfume) => (
            <Col key={perfume.id} md={6} className='mb-4'>
              <Card className='perfume-card'>
                <Card.Body>
                  <Button className='favourite-button' onClick={() => handleAddToFavourites(perfume.title.slice(0, perfume.title.length - 2))}>Add to favourites</Button>
                  <Card.Title><strong>{perfume.title.replace(/^[^\w\d]*([\w\d].*[\w\d])?[^\w\d]*$/, '$1')  // Trim non-word characters
                    .replace(/\*/g, ' ')  // Replace asterisks with spaces
                    .trim()}</strong></Card.Title>
                  {perfume.details.map((line, index) => (
                    <p key={index} className="perfume-detail">
                      {line.startsWith('**Notes:**') ? <strong>Notes:</strong> : line.startsWith('**Description:**') ? <strong>Description:</strong> : line.replace(/\*\*/g, '')}
                    </p>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
      </div>
    );
  };

  return (
    <div className='py-5 hero-background'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card'>
          <h1 className="hero-title">Find Your Perfume</h1>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your preferred smells"
            className="mb-3 description-box"
            rows="4"
          />
          <Button onClick={handleGetRecommendations} disabled={isLoading} className="recommend-button">
            {isLoading ? 'Loading...' : 'Get Recommendations'}
          </Button>
          <div className='mt-4 w-100'>
            {renderRecommendations()}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
