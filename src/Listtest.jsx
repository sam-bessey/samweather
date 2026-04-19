export default function Listtest({ items }) {
    const listItems = items.map((item) => <li className="bg-transparent hover:bg-green-200 transition-all rounded-lg m-2 active:scale-95" key={item}>{item}</li>);
    return (
        <ul className="bg-blue-100 hover:bg-blue-200 text-black font-bold py-2 px-6 rounded-md transition-all transform hover:scale-105">
            {listItems}
        </ul>
    );
}
