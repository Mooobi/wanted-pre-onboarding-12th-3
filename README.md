# 프로젝트 개요

원티드 프리온보딩 3번째 과제로 검색창 구현 + 검색어 추천 기능 구현 + 캐싱 기능 구현을 목표로 하는 프로젝트입니다.

# 구현 과정

## 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현

검색어를 매개변수로 받는 `useFetch`라는 커스텀 훅을 만들고, 검색어를 의존성으로 하는 `useEffect`를 사용하여 구현하였습니다.

```ts
export default function useFetch(query: string) {
  const [dataState, setDataState] = useState<DataState>({
    data: null,
    loading: true,
  });

  useEffect(() => {
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

## API 호출별로 로컬 캐싱 구현

브라우저 캐시 스토리지를 사용한 `cacheManager` 클래스를 만들고, `get`, `set`메서드를 활용하여 로컬 캐싱을 구현하였습니다. 새로고침 해도 캐시 데이터가 남아있어 만료 시간을 구현한다면 상태, 스토어를 사용한 방법보다 캐시 데이터 활용도가 높다고 판단했지만 만료 시간은 구현하지 못하였습니다.

```ts
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

`useFetch` 커스텀 훅 내에서 cache 데이터 존재 여부에 따라 조건 분기하여 존재하지 않는다면 데이터 요청 후 캐시 저장, 있다면 요청하지 않고 캐시 데이터를 불러오도록 구현하였습니다.

```ts
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

## 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행

`useFetch` 내에서 `fetchData`함수를 `setTimeOut()`의 콜백함수로 하여 `fetchTimeout`을 선언해주었습니다. 사용자가 입력을 멈추고 0.3초 후에 요청이 가도록 만들어 api 호출횟수를 줄였습니다.

```ts
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

## 키보드만으로 추천 검색어들로 이동 가능하도록 구현

`SearchBar`컴포넌트 내에 `handleKeyDown`이라는 이벤트 핸들러를 만들고 검색 시 포커스가 되어 있는 `Input`컴포넌트에서 이벤트가 발생하면 `currentIndex`를 변하도록 만들고 목록 중 `index`가 `currentIndex`와 같은 요소만 background 속성을 주었습니다.

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
