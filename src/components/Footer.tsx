import styled from 'styled-components';
import { useI18n } from '../i18n';

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
  const { messages } = useI18n();

  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          {messages.footer.copyrightLead}
          <a href="https://www.illgames.jp/" target="_blank" rel="noopener noreferrer">
            ILLGAMES
          </a>
          {messages.footer.copyrightTail}
        </Copyright>
        <Copyright>
          {messages.footer.termsLead}
          <a href="https://www.illgames.jp/copyright.php" target="_blank" rel="noopener noreferrer">
            {messages.footer.termsLink}
          </a>
          {messages.footer.termsTail}
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
}
