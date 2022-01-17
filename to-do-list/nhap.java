

import java.util.Scanner;

public class nhap {
    /*
   tim uoc chung lon nhat va boi chung nho nhat cua a va b
    */
    public static void main(String[] args) {
        int a, b, x, y;
        System.out.println("Enter a and b: ");
        Scanner sc = new Scanner(System.in);
        a = sc.nextInt();
        b = sc.nextInt();
        x = a;
        y = b;
        while (x != y){
            if (x > y){
                x = x - y;
            }else  y = y - x;
        }
        System.out.println("Uoc chung lon nhat la: " + x);
        y = a*b/x;
        System.out.println("Boi chung nho nhat la: " + y);
        sc.close();
    }
}
