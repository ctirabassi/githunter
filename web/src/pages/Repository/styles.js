import styled from 'styled-components';

export const Loading = styled.div`
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const Owner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    color: #7159c1;
    font-size: 16px;
    text-decoration: none;
  }

  img {
    width: 120px;
    border-radius: 50%;
    margin-top: 20px;
  }

  h1 {
    font-size: 24px;
    margin-top: 10px;
  }

  p {
    margin-top: 5px;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
    text-align: center;
    max-width: 400px;
  }
  div {
    margin-top: 10px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    justify-items: center;
    align-items: center;
    font-size: 10px;
  }
`;

export const ButtonFilter = styled.button.attrs(props => ({
  type: 'button',
  disabled: props.filter,
}))`
  height: 30px;
  width: 80px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.5);
  border: 0;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    font-weight: bold;
  }

  &[disabled] {
    background: #7159c1;
    color: #fff;
  }

  &:focus {
    background: #7159c1;
    color: #fff;
  }
`;

export const ButtonPage = styled.button.attrs(props => ({
  type: 'button',
  disabled: props.lock,
}))`
  height: 20px;
  width: 50px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.5);
  border: 0;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 10px;

  &:active {
    background: #7159c1;
    color: #fff;
  }

  &[disabled] {
    color: #eee;
  }
`;

export const IssuesList = styled.ul`
  padding-top: 30px;
  margin-top: 30px;
  border-top: 1px solid #eee;
  list-style: none;

  li {
    display: flex;
    padding: 15px 10px;
    border: 1px solide #eee;
    border-radius: 4px;

    & + li {
      border-top: 1px solid #eee;
    }
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solied #eee;
  }

  div {
    flex: 1;
    margin-left: 15px;

    strong {
      font-size: 16px;

      a {
        text-decoration: none;
        color: #333;

        &:hover {
          color: #7159c1;
        }
      }

      span {
        background: #eee;
        color: #333;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        height: 20px;
        padding: 3px 4px;
        margin-left: 10px;
      }
    }

    p {
      margin-top: 5px;
      font-size: 12px;
      color: #999;
    }
  }
`;
