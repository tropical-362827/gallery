import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--surface-color);
  padding: var(--spacing-lg) var(--spacing-xl);
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Copyright = styled.p`
  color: var(--text-secondary-color);
  font-size: 0.9rem;
  margin-bottom: 0;
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          ハニカム/サマすくのデータの著作権はILLGAMESに帰属します。
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
}