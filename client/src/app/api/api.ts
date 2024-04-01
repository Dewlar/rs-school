import { GarageData, ICar, ICreateCar, IEngine, IOrder, ISort, IWinners, SERVER_URL } from './interface';

const garage = `${SERVER_URL}/garage`;
const engine = `${SERVER_URL}/engine`;
const winners = `${SERVER_URL}/winners`;

export const getCars = async (page: number, limit = 7): Promise<GarageData> => {
  try {
    const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
    const items: ICar[] = await response.json();

    return {
      items: await Promise.all(items),
      count: response.headers.get('X-Total-Count'),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch/get cars: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const getCar = async (id: number): Promise<ICar> => (await fetch(`${garage}/${id}`)).json();

export const createCar = async (param: ICreateCar): Promise<ICar> => {
  try {
    const response = await fetch(`${garage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create car: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const deleteCar = async (id: number): Promise<void> => {
  try {
    await fetch(`${garage}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete car: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const updateCar = async (id: number, param: ICreateCar): Promise<ICar> => {
  try {
    const response = await fetch(`${garage}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update car: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const engineStatus = async (id: number, status: 'started' | 'stopped'): Promise<IEngine> => {
  try {
    const response = await fetch(`${engine}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update engine status: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const driveMode = async (id: number): Promise<Response> => {
  try {
    return await fetch(`${engine}?id=${id}&status=drive`, {
      method: 'PATCH',
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update drive state: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const getWinners = async (
  page: number,
  sort: ISort = 'time',
  order: IOrder = 'ASC',
  limit = 10
): Promise<{ result: Array<IWinners>; totalCount: string }> => {
  try {
    const data = await fetch(`${winners}/?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
    const res: Array<IWinners> = await data.json();

    return {
      result: res,
      totalCount: data.headers.get('X-Total-Count') || '0',
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch/get winners: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const getWinner = async (winnerId: number): Promise<IWinners> => {
  try {
    const data = await fetch(`${winners}/${winnerId}`);
    return await data.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch/get winner: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const createWinner = async (carData: IWinners): Promise<void> => {
  try {
    await fetch(`${winners}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create winner: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const deleteWinner = async (carId: number): Promise<void> => {
  try {
    await fetch(`${winners}/${carId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete winner: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};

export const updateWinner = async (carData: IWinners): Promise<void> => {
  try {
    await fetch(`${winners}/${carData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update winner: ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};
