import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setPosts(data);
  };

  return (
    <Section>
      <BackgroundGlow />
      <GridOverlay />

      <Container>
        <Heading>Latest Insights</Heading>

        <Grid>
          {posts.map((post) => (
            <Card
              key={post.id}
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              {post.cover_image && (
                <ImageWrapper>
                  <img src={post.cover_image} alt={post.title} />
                </ImageWrapper>
              )}

              <CardContent>
                <Title>{post.title}</Title>

                <Preview
                  dangerouslySetInnerHTML={{
                    __html:
                      post.content.length > 150
                        ? post.content.slice(0, 150) + "..."
                        : post.content,
                  }}
                />

                <Meta>
                  <span>
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <ReadMore>Read Article →</ReadMore>
                </Meta>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

/* ================= ANIMATIONS ================= */

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ================= STYLES ================= */

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  padding: 100px 8%;
  background: linear-gradient(-45deg, #0b1120, #0f172a, #111827, #0b1120);
  background-size: 400% 400%;
  animation: ${gradientMove} 18s ease infinite;
  overflow: hidden;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, #00f5ff, transparent 70%);
  border-radius: 50%;
  top: -200px;
  left: -200px;
  filter: blur(140px);
  opacity: 0.3;
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: auto;
`;

const Heading = styled.h1`
  font-size: 2.6rem;
  text-align: center;
  margin-bottom: 60px;
  background: linear-gradient(90deg, #00f5ff, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeUp} 0.6s ease forwards;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 40px;
`;

const Card = styled.div`
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  animation: ${fadeUp} 0.8s ease forwards;

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 25px 60px rgba(0,245,255,0.25);
  }
`;

const ImageWrapper = styled.div`
  height: 220px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.08);
  }
`;

const CardContent = styled.div`
  padding: 28px;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  color: #e2e8f0;
  margin-bottom: 14px;
  line-height: 1.4;
`;

const Preview = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
`;

const ReadMore = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #00f5ff, #7c3aed);
  color: #000;
  font-weight: 600;
  transition: all 0.3s ease;

  ${Card}:hover & {
    transform: translateX(5px);
  }
`;
