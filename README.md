## 프로젝트 소개

이 프로젝트는 원티드 프리온보딩 프론트엔드 12기 과정의 2주차 과제로,  
검색창 구현 + 검색어 추천 기능 구현 + 캐싱 기능 구현을 목표로 하는 프로젝트입니다.

참여자: 박무생

[배포링크](https://wanted-pre-onboarding-12th-3.vercel.app/)

서버가 구축되어있지 않기 때문에 아래 링크로 접속한 후 안내에 따라 서버를 활성화하여야 검색 데이터가 나타납니다.
(로컬환경에서도 동일)

[api repository](https://github.com/walking-sunset/assignment-api)

## 폴더 구조
```
root
└── src/
    ├── components
    ├── constants
    ├── context
    ├── hooks
    ├── pages
    ├── services
    ├── style
    ├── type
    ├── utils
    ├── App.tsx
    └── main.tsx
```

## 실행 방법

위 배포 링크를 클릭하여 배포환경에서 실행하거나,
로컬 환경의 터미널에서 clone 후 npm install, npm run dev 순으로 입력하여 로컬환경에서 실행할 수 있습니다.

```
git clone https://github.com/Mooobi/wanted-pre-onboarding-12th-3.git
npm install
npm run dev
```

## 사용 스택

<img src='https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white' alt='html5' />
<img src='https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white' alt='css3' />
<img src='https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white' alt='css3' />
<img src='https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white' alt='ts' />
<img src='https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB' alt='react' />
<img src='https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white' alt='styled_components' />
<img src='https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white' alt='eslint' />
<img src='https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E' alt='prettier' />

## 요구사항
- 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현
  - 검색어가 없을 시 “검색어 없음” 표출
- API 호출별로 로컬 캐싱 구현
  - 캐싱 기능을 제공하는 라이브러리 사용 금지(React-Query 등)
  - 캐싱을 어떻게 기술했는지에 대한 내용 README에 기술
  - expire time을 구현할 경우 가산점
- 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행
- API를 호출할 때 마다 console.info("calling api") 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정
- 키보드만으로 추천 검색어들로 이동 가능하도록 구현
 
## 구현 화면
![Sep-09-2023 23-02-32](https://github.com/Mooobi/wanted-pre-onboarding-12th-3/assets/124570875/ac8db8f5-80a5-4f6c-a567-316c3d6f1a7c)

## 개발 과정
### 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현
검색어를 매개변수로 받는 useFetch 훅을 만들고 useEffect 내부에서 검색어가 바뀔 때마다 fetch요청을 하는 fetchData 함수를 넣어주었습니다. 

```ts
// useFetch.ts
export default function useFetch(query: string) {
  const [dataState, setDataState] = useState<DataState>({
    data: null,
    loading: true,
  });

  useEffect(() => {
      const fetchData = async () => {
            ...
            const response = await fetch(`${BASE_URL}?q=${query}`);
            console.info('calling api');
            if (!response.ok) {
              throw new Error(`${response.status}`);
            }

            const responseData = await response.json();
            ...
            setDataState({
              data: responseData,
              loading: true,
            });
            ...
  }, [query]);

  const { data, loading } = dataState;

  return { data, loading };
}
```

훅에서 반환하는 data와 loading을 RecommendList 컴포넌트에서 받아 추천 검색어를 화면에 렌더링해주게끔 하였고, lodaing 여부와 추천검색어 존재 여부에 따라 다르게 렌더링 되게 해주었습니다.

```ts
// RecommendList.tsx
export default function RecommendList({ currentIndex }: { currentIndex: number }) {
  ...

  const { data, loading } = useFetch(inputValue);

  if (loading) return <Container>Loading...</Container>;

  if (!data || !data.length) return NO_RECOMMENDED_SEARCH_TEXT;

  const slicedData = data.slice(0, 20);

  return (
    <Container>
      {slicedData.map((item, index) => (
        <Wrapper key={item.sickCd} $isFocus={index === currentIndex}>
          <AiOutlineSearch size='1.25rem' fill='#aaaaaa' className='icon' />
          <TextFiled>{item.sickNm}</TextFiled>
        </Wrapper>
      ))}
    </Container>
  );
}
```

### API 호출별로 로컬 캐싱 구현
브라우저 캐시 스토리지를 사용한 cacheManager 클래스를 만들고, get, set메서드를 활용하여 로컬 캐싱을 구현하였습니다. 새로고침 해도 캐시 데이터가 남아있어 만료 시간을 구현한다면 상태, 스토어를 사용한 방법보다 캐시 데이터 활용도가 높다고 판단했습니다.

(하지만 기한 내에 만료시간을 구현하지 못했습니다.)

```ts
// CacheManager.ts
export class CacheManager {
  cacheName: string;

  constructor(cacheName: string) {
    this.cacheName = cacheName;
  }

  async get(key: string) {
    try {
      const cache = await caches.open(this.cacheName);
      const cachedResponse = await cache.match(key);

      if (cachedResponse) {
        return cachedResponse;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async set(key: string, data: Response) {
    try {
      const cache = await caches.open(this.cacheName);
      await cache.put(key, data.clone());
    } catch (error) {
      console.error(error);
    }
  }
}
```

타입 스크립트의 interface를 사용한 추상을 표현해주지 않았습니다. 추상을 표현한다면 아래처럼 사용하여 추상만 보고도 다른 컴포넌트에서 해당 class를 사용할 수 있을 것 같습니다.

```ts
interface CacheManager {
  get(key: string): Promise<Response | null>;
  set(key: string, data: Response): void;
}

export class CacheManagerImpl implements CacheManager {
  ...
}
``` 

useFetch 훅 내에서 cache 데이터 존재 여부에 따라 조건 분기하여 존재하지 않는다면 데이터 요청 후 캐시 저장, 있다면 요청하지 않고 캐시 데이터를 불러오도록 구현하였습니다.

```ts
// useFetch.ts
export default function useFetch(query: string) {
  const [dataState, setDataState] = useState<DataState>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    const cacheManager = new CacheManager(query); // instance 생성

    const fetchTimeout = setTimeout(() => {
      const fetchData = async () => {
        try {
          if (query.length) { // 캐시 데이터 받아오기
            const cachedData = await getCachedData(cacheManager, query);

            if (cachedData) { // 캐시 데이터가 있다면
              setDataState({ // 상태로 저장하여 화면에 출력
                data: cachedData,
                loading: false,
              });
              return;
            }
          ... // 없다면 위의 fetch 요청
          ...
  }, [query]);

  const { data, loading } = dataState;

  return { data, loading };
}
```

입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행
useFetch 훅 내에서 fetchData함수를 setTimeOut의 콜백함수로 하는 fetchTimeout을 선언해주었습니다. 사용자가 입력을 멈추고 0.3초 후에 요청이 가도록 만들어 api 요청횟수를 줄였습니다.

```ts
// useFetch.ts
export default function useFetch(query: string) {
  const [dataState, setDataState] = useState<DataState>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    const cacheManager = new CacheManager(query);

    const fetchTimeout = setTimeout(() => {
      // setTimeout
      const fetchData = async () => {
      ...
      fetchData();
    }, 300); // 0.3초마다 실행

    return () => {
      // 언마운트 시 fetchTimeout 삭제
      clearTimeout(fetchTimeout);
    };
  }, [query]);

  const { data, loading } = dataState;

  return { data, loading };
}
```

### 키보드만으로 추천 검색어들로 이동 가능하도록 구현
SearchBar 컴포넌트 내에 handleKeyDown이라는 이벤트 핸들러를 만들고 검색 시 포커스가 되어 있는 Input컴포넌트에서 이벤트가 발생하면 currentIndex를 변하도록 만들고 목록 중 index가 currentIndex와 같은 요소만 background 속성을 주었습니다.

```ts
// SearchBar.tsx
export default function SearchBar() {
  ...
  // 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown' && currentIndex < 20) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      <Wrapper $isFocused={isFocused}>
        {isFocused ? (
          <Input onFocus={borderOn} onBlur={borderOff} onArrowKeyPress={handleKeyDown} /> // 이벤트 핸들러 props로 전달
        ) : (
          <PlaceHolder onClick={borderOn} />
        )}
        <Button />
      </Wrapper>
      <AutoCompleteBox isFocused={isFocused} currentIndex={currentIndex} /> // 현재 인덱스 props로 전달
    </>
  );
}
```
```ts
//Input.tsx
export default function Input({
  ...
  onArrowKeyPress,
}: {
  ...
  onArrowKeyPress: (e: React.KeyboardEvent<HTMLElement>) => void;
}) {
  ...
  // 키가 위,아래 방향키일 때 이벤트 핸들러 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      onArrowKeyPress(e);
    }
  };

  return (
    <Wrapper>
      <S_Input
        onFocus={onFocus}
        onBlur={() => {
          onBlur();
          setInput('');
        }}
        type='text'
        autoFocus
        value={inputValue}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown} // 키가 눌러지면 이벤트 핸들러 실행
      />
      <MdOutlineCancel size='1.75rem' fill='#aaaaaa' />
    </Wrapper>
  );
}
```
```ts
// RecommendList.tsx
export default function RecommendList({ currentIndex }: { currentIndex: number }) {
  ...
  return (
    <Container>
      {slicedData.map((item, index) => (
        <Wrapper key={item.sickCd} $isFocus={index === currentIndex}>
        {/* props drilling으로 전달받은 currentIndex와 index를 비교 */}
          <AiOutlineSearch size='1.25rem' fill='#aaaaaa' className='icon' />
          <TextFiled>{item.sickNm}</TextFiled>
          {index}
        </Wrapper>
      ))}
    </Container>
  );
}
```

### context API
Input 컴포넌트에서 입력된 값을 상태로 만들고, 추천 검색어를 띄우는 RecommendList에서 상태를 사용하기 위해 context API를 사용하였습니다. InputContext를 생성하고 InputValue와 setInput을 공유하는 InputProvider 생성해주었습니다.

```ts
import { ReactNode, createContext, useState } from 'react';

export const InputContext = createContext<{
  inputValue: string;
  setInput: (value: string) => void;
} | null>(null);

export function InputProvider({ children }: { children: ReactNode }) {
  const [inputValue, setInputValue] = useState('');

  const setInput = (value: string) => {
    setInputValue(value);
  };

  return <InputContext.Provider value={{ inputValue, setInput }}>{children}</InputContext.Provider>;
}
```

그리고 Home 컴포넌트에서 SearchBar 컴포넌트를 Provider로 감싸주어 공유 영역을 지정해주었습니다.

```ts
// Home.tsx
export default function Home() {
  return (
    <Wrapper>
      <Title>
        {TITLE_TEXT_1}
        <br />
        {TITLE_TEXT_2}
      </Title>
      <InputProvider>
        <SearchBar />
      </InputProvider>
    </Wrapper>
  );
}
```

useContext를 편리하게 사용하기 위해 inputValue와 setInput을 반환하는 useInput 훅을 만들어주었습니다. 이 훅에서 inputValue와 setInput을 받아 Input 컴포넌트와 RecommedList 컴포넌트에서 상태 관리를 해주었습니다.

```ts
// useInput.ts
export default function useInput(): { inputValue: string; setInput: (value: string) => void } {
  const contextValue = useContext(InputContext);
  if (contextValue === null) {
    throw new Error(INPUTCONTEXT_ERROR_MESSAGE);
  }
  return contextValue;
}
```
