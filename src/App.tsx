import { useRef } from 'react';
import './App.css';

// TODO: move to types file
interface ResponseItem {
    startIndex: number;
    endIndex: number;
    replacement: string;
    original: string;
}

// TODO: move to types file
type ResponseType = ResponseItem[];

// TODO: move to mocks file
const getCorrections = (text: string): ResponseType => {
    //* assuming response is sorted by startIndex or endIndex
    const res = [
        // {
        //     startIndex: 0,
        //     endIndex: 2,
        //     replacement: 'TEST1',
        //     original: 'The',
        // },
        {
            startIndex: 4,
            endIndex: 6,
            replacement: 'only',
            original: 'oly',
        },
        {
            startIndex: 25,
            endIndex: 28,
            replacement: 'fear',
            original: 'feer',
        },
        // {
        //     startIndex: 37,
        //     endIndex: 38,
        //     replacement: '_',
        //     original: ' ',
        // },
        // {
        //     startIndex: 38,
        //     endIndex: 43,
        //     replacement: 'TEST2',
        //     original: 'itself',
        // },
        // {
        //     startIndex: 44,
        //     endIndex: 44,
        //     replacement: '!',
        //     original: '.',
        // },
    ];

    return res;
};

const updatedContent = (str: string, updateConfig: ResponseType): string => {
    if (updateConfig.length === 0) return str;

    let newInnerHTML = '';
    let index = 0;
    let textIndex = 0;
    let updateConfigIndex = 0;
    let currentReplacementIndex = 0;

    while (index < str.length) {
        // TODO: move '<' and '>' to constant file
        if (str[index] === '<') {
            while (str[index] !== '>') {
                newInnerHTML += str[index++];
            }
            newInnerHTML += str[index++];
        } else {
            if (
                updateConfigIndex < updateConfig.length &&
                textIndex >= updateConfig[updateConfigIndex].startIndex &&
                textIndex <= updateConfig[updateConfigIndex].endIndex
            ) {
                if (
                    currentReplacementIndex <
                    updateConfig[updateConfigIndex].replacement.length
                ) {
                    newInnerHTML +=
                        updateConfig[updateConfigIndex].replacement[
                            currentReplacementIndex++
                        ];
                } else {
                    const move =
                        updateConfig[updateConfigIndex].endIndex -
                        textIndex +
                        1;
                    index += move;
                    textIndex += move;
                    currentReplacementIndex = 0;
                    updateConfigIndex++;
                    continue;
                }
            } else {
                if (currentReplacementIndex === 0) {
                    newInnerHTML += str[index];
                } else {
                    newInnerHTML += updateConfig[
                        updateConfigIndex
                    ].replacement.substring(currentReplacementIndex);
                    index--;
                    textIndex--;
                    currentReplacementIndex = 0;
                    updateConfigIndex++;
                }
            }
            index++;
            textIndex++;
        }
    }

    return newInnerHTML;
};

function App() {
    const pRef = useRef<HTMLParagraphElement>(null);

    const onCorrectClick = () => {
        if (!pRef.current) return;

        const { innerText, innerHTML } = pRef.current;
        const response = getCorrections(innerText); // we should await for actual response
        /**
         * In this scenario we are not setting the innerHTML with a response
         * from the backend directly so this would not lead to any
         * security issues like Man in the middle attack.
         *
         * Although, we can have basic filtering (sanity) here too.
         */
        pRef.current.innerHTML = updatedContent(innerHTML, response);
    };

    return (
        <>
            <p ref={pRef}>
                The oly thing we have to{' '}
                <span className="blue">
                    <span className="font-2">f</span>eer is fear
                </span>{' '}
                itself.
            </p>
            <button onClick={onCorrectClick}>Correct</button>
        </>
    );
}

export default App;
