export class Dish {
    name: string;
    image: string;
    category: string;
    label: string;
    price: string;
    description: string;
    comments(
    	public rating: number,
    	public comment: string,
    	public author: string,
    	public date: string
    	) { }
}